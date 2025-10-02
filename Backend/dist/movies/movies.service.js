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
    tmdbBaseUrl = "https://api.themoviedb.org/3";
    constructor(httpService, configService) {
        this.httpService = httpService;
        this.configService = configService;
        const apiKey = this.configService.get("TMDB_API_KEY");
        if (!apiKey) {
            throw new Error("TMDB_API_KEY is not defined in the .env file");
        }
        this.tmdbApiKey = apiKey;
    }
    getPopularMovies() {
        return this.fetchAndProcessMovies({ sort_by: "popularity.desc" });
    }
    getTopRatedMovies() {
        return this.fetchAndProcessMovies({
            sort_by: "vote_average.desc",
            "vote_count.gte": "200",
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
        const pagesToFetch = 2;
        const pageRequests = [];
        for (let i = 1; i <= pagesToFetch; i++) {
            const discoverUrl = new url_1.URL(`${this.tmdbBaseUrl}/discover/movie`);
            discoverUrl.searchParams.append("api_key", this.tmdbApiKey);
            discoverUrl.searchParams.append("vote_count.gte", "150");
            Object.entries(discoveryParams).forEach(([key, value]) => {
                discoverUrl.searchParams.append(key, value);
            });
            discoverUrl.searchParams.append("page", i.toString());
            const request = (0, rxjs_1.firstValueFrom)(this.httpService
                .get(discoverUrl.toString())
                .pipe((0, rxjs_1.map)((res) => res.data.results)));
            pageRequests.push(request);
        }
        this.logger.log(`Phase 1: Discovering movies from ${pagesToFetch} pages.`);
        try {
            const pagesResults = await Promise.all(pageRequests);
            const basicMovies = pagesResults.flat();
            this.logger.log(`Phase 1: Found ${basicMovies.length} movie candidates.`);
            const detailedMovies = await Promise.all(basicMovies.map((movie) => this.getMovieDetails(movie.id)));
            const moviesWithLogo = detailedMovies.filter((movie) => movie.logoUrl);
            this.logger.log(`Phase 3: Filtered down to ${moviesWithLogo.length} movies with a logo.`);
            return moviesWithLogo.slice(0, 30);
        }
        catch (error) {
            this.logger.error(`Failed during multi-page fetch process`, error.stack);
            throw new Error("Could not process movies request.");
        }
    }
    async getMovieDetails(id) {
        const detailsUrl = new url_1.URL(`${this.tmdbBaseUrl}/movie/${id}`);
        detailsUrl.searchParams.append("api_key", this.tmdbApiKey);
        detailsUrl.searchParams.append("append_to_response", "credits,images,keywords,release_dates");
        detailsUrl.searchParams.append("include_image_language", "en,null");
        const rawData = await (0, rxjs_1.firstValueFrom)(this.httpService.get(detailsUrl.toString()).pipe((0, rxjs_1.map)((res) => res.data)));
        const englishLogo = rawData.images?.logos?.find((logo) => logo.iso_639_1 === "en");
        const fsk = rawData.release_dates.results
            .find((r) => r.iso_3166_1 === "DE")
            ?.release_dates.find((d) => d.certification !== "")?.certification ||
            "N/A";
        const backdropUrls = rawData.images?.backdrops?.map((backdrop) => `https://image.tmdb.org/t/p/original${backdrop.file_path}`) || [];
        const movie = {
            id: rawData.id,
            title: rawData.title,
            overview: rawData.overview,
            posterUrl: rawData.poster_path
                ? `https://image.tmdb.org/t/p/w500${rawData.poster_path}`
                : null,
            backdropUrl: backdropUrls.length > 0 ? backdropUrls[0] : null,
            backdrops: backdropUrls,
            runtime: rawData.runtime,
            genres: rawData.genres.map((genre) => genre.name),
            fsk: fsk,
            vote_average: rawData.vote_average,
            release_date: rawData.release_date,
            logoUrl: englishLogo
                ? `https://image.tmdb.org/t/p/w500${englishLogo.file_path}`
                : null,
        };
        return movie;
    }
};
exports.MoviesService = MoviesService;
exports.MoviesService = MoviesService = MoviesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], MoviesService);
//# sourceMappingURL=movies.service.js.map