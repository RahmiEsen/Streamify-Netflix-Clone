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
exports.Movie = exports.Keyword = exports.ImageSet = void 0;
const graphql_1 = require("@nestjs/graphql");
let ImageSet = class ImageSet {
    posterUrl;
    backdropUrl;
    backdropUrl2;
    heroBackdropUrlDesktop;
    heroBackdropUrlMobile;
    logoUrl;
};
exports.ImageSet = ImageSet;
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], ImageSet.prototype, "posterUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], ImageSet.prototype, "backdropUrl", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], ImageSet.prototype, "backdropUrl2", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], ImageSet.prototype, "heroBackdropUrlDesktop", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], ImageSet.prototype, "heroBackdropUrlMobile", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", Object)
], ImageSet.prototype, "logoUrl", void 0);
exports.ImageSet = ImageSet = __decorate([
    (0, graphql_1.ObjectType)()
], ImageSet);
let Keyword = class Keyword {
    id;
    name;
};
exports.Keyword = Keyword;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Keyword.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Keyword.prototype, "name", void 0);
exports.Keyword = Keyword = __decorate([
    (0, graphql_1.ObjectType)()
], Keyword);
let Movie = class Movie {
    id;
    title;
    imageSet;
    overview;
    vote_average;
    release_date;
    runtime;
    genres;
    keywords;
    fsk;
};
exports.Movie = Movie;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int),
    __metadata("design:type", Number)
], Movie.prototype, "id", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Movie.prototype, "title", void 0);
__decorate([
    (0, graphql_1.Field)(() => ImageSet, { nullable: true }),
    __metadata("design:type", Object)
], Movie.prototype, "imageSet", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Movie.prototype, "overview", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Float),
    __metadata("design:type", Number)
], Movie.prototype, "vote_average", void 0);
__decorate([
    (0, graphql_1.Field)(),
    __metadata("design:type", String)
], Movie.prototype, "release_date", void 0);
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], Movie.prototype, "runtime", void 0);
__decorate([
    (0, graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], Movie.prototype, "genres", void 0);
__decorate([
    (0, graphql_1.Field)(() => [Keyword], { nullable: true }),
    __metadata("design:type", Array)
], Movie.prototype, "keywords", void 0);
__decorate([
    (0, graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], Movie.prototype, "fsk", void 0);
exports.Movie = Movie = __decorate([
    (0, graphql_1.ObjectType)({ description: 'Represents a movie from TMDB' })
], Movie);
//# sourceMappingURL=movie.entity.js.map