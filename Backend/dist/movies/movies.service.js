"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var MoviesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const url_1 = require("url");
let MoviesService = MoviesService_1 = class MoviesService {
    httpService;
    configService;
    logger = new common_1.Logger(MoviesService_1.name);
    tmdbApiKey;
    tmdbBaseUrl = 'https://api.themoviedb.org/3';
    imageBaseUrl = 'https://image.tmdb.org/t/p/';
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        const apiKey = this.configService.get('TMDB_API_KEY');
        if (!apiKey) {
            throw new Error('TMDB_API_KEY is not defined in the .env file');
        }
        this.tmdbApiKey = apiKey;
    }
    getPopularMovies() {
        return this.fetchAndProcessMovies({ sort_by: 'popularity.desc' });
    }
    getTopRatedMovies() {
        return this.fetchAndProcessMovies({
            sort_by: 'vote_average.desc',
            'vote_count.gte': '200',
        });
    }
    getMoviesByGenre(genreId) {
        return this.fetchAndProcessMovies({ with_genres: genreId.toString() });
    }
    getMovieById(id) {
        this.logger.log(`Fetching details for movie with id: ${id}`);
        return this.getMovieDetails(id);
    }
    async fetchAndProcessMovies(discoveryParams) {
        try {
            const basicMovies = await this.discoverMovies(discoveryParams, 2);
            this.logger.log(`Found ${basicMovies.length} movie candidates.`);
            const detailedMovies = await this.fetchDetailedMovies(basicMovies);
            const moviesWithLogo = detailedMovies.filter((movie) => movie.imageSet?.logoUrl);
            this.logger.log(`Filtered to ${moviesWithLogo.length} movies with a logo.`);
            return moviesWithLogo.slice(0, 30);
        }
        catch (error) {
            this.logger.error(`Failed during multi-page fetch process`, error.stack);
            throw new Error('Could not process movies request.');
        }
    }
    async discoverMovies(params, pages) {
        const pageRequests = Array.from({ length: pages }, (_, i) => {
            const discoverUrl = this.buildDiscoverUrl(params, i + 1);
            return (0, rxjs_1.firstValueFrom)(this.httpService
                .get(discoverUrl.toString())
                .pipe((0, rxjs_1.map)((res) => res.data.results)));
        });
        const pagesResults = await Promise.all(pageRequests);
        return pagesResults.flat();
    }
    buildDiscoverUrl(params, page) {
        const url = new url_1.URL(`${this.tmdbBaseUrl}/discover/movie`);
        url.searchParams.append('api_key', this.tmdbApiKey);
        url.searchParams.append('vote_count.gte', '150');
        url.searchParams.append('page', page.toString());
        Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
        return url;
    }
    async fetchDetailedMovies(movies) {
        return Promise.all(movies.map((movie) => this.getMovieDetails(movie.id)));
    }
    async getMovieDetails(id) {
        const rawData = await this.fetchRawMovieDetails(id);
        return this.transformRawDataToMovie(rawData);
    }
    fetchRawMovieDetails(id) {
        const url = new url_1.URL(`${this.tmdbBaseUrl}/movie/${id}`);
        url.searchParams.append('api_key', this.tmdbApiKey);
        url.searchParams.append('append_to_response', 'credits,images,keywords,release_dates');
        url.searchParams.append('include_image_language', 'en,null');
        return (0, rxjs_1.firstValueFrom)(this.httpService.get(url.toString()).pipe((0, rxjs_1.map)((res) => res.data)));
    }
    transformRawDataToMovie(rawData) {
        const mainBackdropPath = rawData.backdrop_path;
        const alternativeBackdrop = rawData.images?.backdrops?.find((b) => b.file_path !== mainBackdropPath);
        const englishLogo = this.findEnglishLogo(rawData.images);
        const imageSet = {
            posterUrl: this.buildImageUrl(rawData.poster_path, 'w500'),
            backdropUrl: this.buildImageUrl(mainBackdropPath, 'w780'),
            backdropUrl2: this.buildImageUrl(alternativeBackdrop?.file_path, 'w780'),
            heroBackdropUrlDesktop: this.buildImageUrl(mainBackdropPath, 'original'),
            heroBackdropUrlMobile: this.buildImageUrl(mainBackdropPath, 'w1280'),
            logoUrl: this.buildImageUrl(englishLogo?.file_path, 'w500'),
        };
        return {
            id: rawData.id,
            title: rawData.title,
            overview: rawData.overview,
            runtime: rawData.runtime,
            genres: rawData.genres.map((g) => g.name),
            keywords: rawData.keywords?.keywords || [],
            fsk: this.getGermanCertification(rawData.release_dates),
            vote_average: rawData.vote_average,
            release_date: rawData.release_date,
            imageSet: imageSet,
        };
    }
    async getHeroMovie() {
        const candidates = await this.fetchAndProcessMovies({
            sort_by: 'popularity.desc',
        });
        const heroMovie = candidates.find((movie) => movie.imageSet?.heroBackdropUrlDesktop && movie.overview);
        if (!heroMovie) {
            throw new Error('Could not find a suitable hero movie.');
        }
        this.logger.log(`Selected "${heroMovie.title}" as Hero Movie.`);
        return heroMovie;
    }
    buildImageUrl(path, size) {
        return path ? `${this.imageBaseUrl}${size}${path}` : null;
    }
    findEnglishLogo(images) {
        return images?.logos?.find((logo) => logo.iso_639_1 === 'en');
    }
    getGermanCertification(releaseDates) {
        const deRelease = releaseDates?.results?.find((r) => r.iso_3166_1 === 'DE');
        const certification = deRelease?.release_dates.find((d) => d.certification !== '')?.certification;
        return certification || 'N/A';
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = MoviesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], MoviesService);
//# sourceMappingURL=movies.service.js.map