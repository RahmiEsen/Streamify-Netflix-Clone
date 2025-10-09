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
var MediaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const rxjs_1 = require("rxjs");
const movie_entity_1 = require("./entities/movie.entity");
const series_entity_1 = require("./entities/series.entity");
const url_1 = require("url");
let MediaService = MediaService_1 = class MediaService {
    httpService;
    configService;
    logger = new common_1.Logger(MediaService_1.name);
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
    async getPopularMedia() {
        const movies = this.fetchAndProcessMedia('movie', {
            sort_by: 'popularity.desc',
        });
        const series = this.fetchAndProcessMedia('tv', {
            sort_by: 'popularity.desc',
        });
        return this.combineAndSortResults(await movies, await series);
    }
    async getTopRatedMedia() {
        const movies = this.fetchAndProcessMedia('movie', {
            sort_by: 'vote_average.desc',
            'vote_count.gte': '200',
        });
        const series = this.fetchAndProcessMedia('tv', {
            sort_by: 'vote_average.desc',
            'vote_count.gte': '200',
        });
        return this.combineAndSortResults(await movies, await series);
    }
    async getMediaByGenre(genreId) {
        const movies = this.fetchAndProcessMedia('movie', {
            with_genres: genreId.toString(),
        });
        const series = this.fetchAndProcessMedia('tv', {
            with_genres: genreId.toString(),
        });
        return this.combineAndSortResults(await movies, await series);
    }
    async getMediaById(id, mediaType) {
        this.logger.log(`Fetching details for ${mediaType} with id: ${id}`);
        return this.getMediaDetails(id, mediaType);
    }
    async getHeroMedia() {
        const candidates = await this.fetchAndProcessMedia('movie', {
            sort_by: 'popularity.desc',
        });
        const heroMedia = candidates.find((media) => media.imageSet?.heroBackdropUrlDesktop && media.overview);
        if (!heroMedia) {
            throw new Error('Could not find a suitable hero media.');
        }
        this.logger.log(`Selected "${heroMedia.title}" as Hero Media.`);
        return heroMedia;
    }
    async fetchAndProcessMedia(mediaType, discoveryParams) {
        try {
            const basicMedia = await this.discoverMedia(mediaType, discoveryParams, 1);
            this.logger.log(`Found ${basicMedia.length} ${mediaType} candidates.`);
            const detailedMedia = await this.fetchDetailedMedia(mediaType, basicMedia);
            const mediaWithLogo = detailedMedia.filter((media) => media.imageSet?.logoUrl);
            this.logger.log(`Filtered to ${mediaWithLogo.length} ${mediaType}s with a logo.`);
            return mediaWithLogo;
        }
        catch (error) {
            this.logger.error(`Failed during fetch process for ${mediaType}`, error.stack);
            throw new Error(`Could not process ${mediaType} request.`);
        }
    }
    async discoverMedia(mediaType, params, pages) {
        const pageRequests = Array.from({ length: pages }, (_, i) => {
            const discoverUrl = this.buildDiscoverUrl(mediaType, params, i + 1);
            return (0, rxjs_1.firstValueFrom)(this.httpService
                .get(discoverUrl.toString())
                .pipe((0, rxjs_1.map)((res) => res.data.results)));
        });
        const pagesResults = await Promise.all(pageRequests);
        return pagesResults.flat();
    }
    buildDiscoverUrl(mediaType, params, page) {
        const url = new url_1.URL(`${this.tmdbBaseUrl}/discover/${mediaType}`);
        url.searchParams.append('api_key', this.tmdbApiKey);
        url.searchParams.append('vote_count.gte', '150');
        url.searchParams.append('page', page.toString());
        Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));
        return url;
    }
    async fetchDetailedMedia(mediaType, mediaItems) {
        return Promise.all(mediaItems.map((item) => this.getMediaDetails(item.id, mediaType)));
    }
    async getMediaDetails(id, mediaType) {
        const rawData = await this.fetchRawMediaDetails(id, mediaType);
        return this.transformRawDataToMedia(rawData, mediaType);
    }
    fetchRawMediaDetails(id, mediaType) {
        const url = new url_1.URL(`${this.tmdbBaseUrl}/${mediaType}/${id}`);
        url.searchParams.append('api_key', this.tmdbApiKey);
        const appendToResponse = mediaType === 'movie'
            ? 'credits,images,keywords,release_dates'
            : 'credits,images,keywords,content_ratings';
        url.searchParams.append('append_to_response', appendToResponse);
        url.searchParams.append('include_image_language', 'en,null');
        return (0, rxjs_1.firstValueFrom)(this.httpService.get(url.toString()).pipe((0, rxjs_1.map)((res) => res.data)));
    }
    combineAndSortResults(movies, series) {
        const combined = [...movies, ...series];
        combined.sort((a, b) => b.vote_average - a.vote_average);
        return combined.slice(0, 30);
    }
    transformRawDataToMedia(rawData, mediaType) {
        const imageSet = this.createImageSet(rawData);
        const isMovie = mediaType === 'movie';
        const commonProperties = {
            id: rawData.id,
            title: isMovie ? rawData.title : rawData.name,
            release_date: isMovie ? rawData.release_date : rawData.first_air_date,
            fsk: isMovie
                ? this.getGermanCertificationForMovie(rawData.release_dates)
                : this.getGermanCertificationForSeries(rawData.content_ratings),
            overview: rawData.overview,
            vote_average: rawData.vote_average,
            imageSet: imageSet,
            genres: rawData.genres?.map((g) => g.name) ?? [],
            keywords: rawData.keywords?.keywords || rawData.keywords?.results || [],
        };
        if (isMovie) {
            return Object.assign(new movie_entity_1.Movie(), {
                ...commonProperties,
                duration: rawData.runtime,
            });
        }
        else {
            return Object.assign(new series_entity_1.Series(), {
                ...commonProperties,
                numberOfSeasons: rawData.number_of_seasons,
            });
        }
    }
    createImageSet(rawData) {
        const mainBackdropPath = rawData.backdrop_path;
        const alternativeBackdrop = rawData.images?.backdrops?.find((b) => b.file_path !== mainBackdropPath);
        const englishLogo = this.findEnglishLogo(rawData.images);
        return {
            posterUrl: this.buildImageUrl(rawData.poster_path, 'w500'),
            backdropUrl: this.buildImageUrl(mainBackdropPath, 'w780'),
            backdropUrl2: this.buildImageUrl(alternativeBackdrop?.file_path, 'w780'),
            heroBackdropUrlDesktop: this.buildImageUrl(mainBackdropPath, 'original'),
            heroBackdropUrlMobile: this.buildImageUrl(mainBackdropPath, 'w1280'),
            logoUrl: this.buildImageUrl(englishLogo?.file_path, 'w500'),
        };
    }
    buildImageUrl(path, size) {
        return path ? `${this.imageBaseUrl}${size}${path}` : null;
    }
    findEnglishLogo(images) {
        return images?.logos?.find((logo) => logo.iso_639_1 === 'en');
    }
    getGermanCertificationForMovie(releaseDates) {
        const deRelease = releaseDates?.results?.find((r) => r.iso_3166_1 === 'DE');
        const certification = deRelease?.release_dates.find((d) => d.certification !== '')?.certification;
        return certification || 'N/A';
    }
    getGermanCertificationForSeries(contentRatings) {
        const deRating = contentRatings?.results?.find((r) => r.iso_3166_1 === 'DE');
        return deRating?.rating || 'N/A';
    }
};
exports.MediaService = MediaService;
exports.MediaService = MediaService = MediaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        config_1.ConfigService])
], MediaService);
//# sourceMappingURL=media.service.js.map