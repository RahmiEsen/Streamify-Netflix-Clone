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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Movie = void 0;
const graphql_1 = require("@nestjs/graphql");
let Movie = class Movie {
    id;
    title;
    overview;
    posterUrl;
    backdropUrl;
    backdrops;
    logoUrl;
    vote_average;
    release_date;
    runtime;
    genres;
    fsk;
};
exports.Movie = Movie;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { description: "The unique identifier of the movie" }),
    __metadata("design:type", Number)
], Movie.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)({ description: "The title of the movie" }),
    __metadata("design:type", String)
], Movie.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, {
        nullable: true,
        description: "The summary of the movie",
    }),
    __metadata("design:type", String)
], Movie.prototype, "overview", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, {
        nullable: true,
        description: "The full URL to the poster image (w500)",
    }),
    __metadata("design:type", Object)
], Movie.prototype, "posterUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, {
        nullable: true,
        description: "The full URL to the backdrop image (original)",
    }),
    __metadata("design:type", Object)
], Movie.prototype, "backdropUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: "itemsAndList" }),
    __metadata("design:type", Array)
], Movie.prototype, "backdrops", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, {
        nullable: true,
        description: "The full URL to the movie logo (German)",
    }),
    __metadata("design:type", Object)
], Movie.prototype, "logoUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float, { description: "The average vote for the movie" }),
    __metadata("design:type", Number)
], Movie.prototype, "vote_average", void 0);
__decorate([
    (0, graphql_1.Field)({ description: 'The release date of the movie, e.g., "2023-10-25"' }),
    __metadata("design:type", String)
], Movie.prototype, "release_date", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, {
        nullable: true,
        description: "The runtime of the movie in minutes",
    }),
    __metadata("design:type", Number)
], Movie.prototype, "runtime", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], {
        nullable: true,
        description: "A list of genre names for the movie",
    }),
    __metadata("design:type", Array)
], Movie.prototype, "genres", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, {
        nullable: true,
        description: "The German MPAA rating (FSK)",
    }),
    __metadata("design:type", String)
], Movie.prototype, "fsk", void 0);
exports.Movie = Movie = __decorate([
    (0, graphql_1.ObjectType)({ description: "Represents a movie from TMDB" })
], Movie);
//# sourceMappingURL=movie.entity.js.map