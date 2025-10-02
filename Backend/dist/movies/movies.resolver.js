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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MoviesResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const movies_service_1 = require("./movies.service");
const movie_entity_1 = require("./entities/movie.entity");
let MoviesResolver = class MoviesResolver {
    moviesService;
    constructor(moviesService) {
        this.moviesService = moviesService;
    }
    getPopularMovies() {
        return this.moviesService.getPopularMovies();
    }
    getTopRatedMovies() {
        return this.moviesService.getTopRatedMovies();
    }
    getMoviesByGenre(genreId) {
        return this.moviesService.getMoviesByGenre(genreId);
    }
    getMovieById(id) {
        return this.moviesService.getMovieById(id);
    }
};
exports.MoviesResolver = MoviesResolver;
__decorate([
    (0, graphql_1.Query)(() => [movie_entity_1.Movie], { name: "popularMovies" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MoviesResolver.prototype, "getPopularMovies", null);
__decorate([
    (0, graphql_1.Query)(() => [movie_entity_1.Movie], { name: "topRatedMovies" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MoviesResolver.prototype, "getTopRatedMovies", null);
__decorate([
    (0, graphql_1.Query)(() => [movie_entity_1.Movie], { name: "moviesByGenre" }),
    __param(0, (0, graphql_1.Args)("genreId", { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MoviesResolver.prototype, "getMoviesByGenre", null);
__decorate([
    (0, graphql_1.Query)(() => movie_entity_1.Movie, { name: "movie" }),
    __param(0, (0, graphql_1.Args)("id", { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MoviesResolver.prototype, "getMovieById", null);
exports.MoviesResolver = MoviesResolver = __decorate([
    (0, graphql_1.Resolver)(() => movie_entity_1.Movie),
    __metadata("design:paramtypes", [movies_service_1.MoviesService])
], MoviesResolver);
//# sourceMappingURL=movies.resolver.js.map