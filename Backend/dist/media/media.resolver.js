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
exports.MediaResolver = void 0;
const graphql_1 = require("@nestjs/graphql");
const media_service_1 = require("./media.service");
const media_entity_1 = require("./entities/media.entity");
let MediaResolver = class MediaResolver {
    mediaService;
    constructor(mediaService) {
        this.mediaService = mediaService;
    }
    getPopularMedia() {
        return this.mediaService.getPopularMedia();
    }
    getTopRatedMedia() {
        return this.mediaService.getTopRatedMedia();
    }
    getMediaByGenre(genreId) {
        return this.mediaService.getMediaByGenre(genreId);
    }
    getMediaById(id, mediaType) {
        return this.mediaService.getMediaById(id, mediaType);
    }
    getHeroMedia() {
        return this.mediaService.getHeroMedia();
    }
};
exports.MediaResolver = MediaResolver;
__decorate([
    (0, graphql_1.Query)(() => [media_entity_1.Media], { name: 'popularMedia' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediaResolver.prototype, "getPopularMedia", null);
__decorate([
    (0, graphql_1.Query)(() => [media_entity_1.Media], { name: 'topRatedMedia' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediaResolver.prototype, "getTopRatedMedia", null);
__decorate([
    (0, graphql_1.Query)(() => [media_entity_1.Media], { name: 'mediaByGenre' }),
    __param(0, (0, graphql_1.Args)('genreId', { type: () => graphql_1.Int })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], MediaResolver.prototype, "getMediaByGenre", null);
__decorate([
    (0, graphql_1.Query)(() => media_entity_1.Media, { name: 'mediaById', nullable: true }),
    __param(0, (0, graphql_1.Args)('id', { type: () => graphql_1.Int })),
    __param(1, (0, graphql_1.Args)('mediaType', { type: () => String })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, String]),
    __metadata("design:returntype", Promise)
], MediaResolver.prototype, "getMediaById", null);
__decorate([
    (0, graphql_1.Query)(() => media_entity_1.Media, { name: 'heroMedia' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MediaResolver.prototype, "getHeroMedia", null);
exports.MediaResolver = MediaResolver = __decorate([
    (0, graphql_1.Resolver)(() => media_entity_1.Media),
    __metadata("design:paramtypes", [media_service_1.MediaService])
], MediaResolver);
//# sourceMappingURL=media.resolver.js.map