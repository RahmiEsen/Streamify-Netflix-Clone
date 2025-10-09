"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const axios_1 = require("@nestjs/axios");
const media_entity_1 = require("./entities/media.entity");
const movie_entity_1 = require("./entities/movie.entity");
const series_entity_1 = require("./entities/series.entity");
const media_resolver_1 = require("./media.resolver");
const media_service_1 = require("./media.service");
const movie_resolver_1 = require("./movie.resolver");
const series_resolver_1 = require("./series.resolver");
let MediaModule = class MediaModule {
};
exports.MediaModule = MediaModule;
exports.MediaModule = MediaModule = __decorate([
    (0, common_1.Module)({
        imports: [axios_1.HttpModule, typeorm_1.TypeOrmModule.forFeature([media_entity_1.Media, movie_entity_1.Movie, series_entity_1.Series])],
        providers: [media_resolver_1.MediaResolver, media_service_1.MediaService, movie_resolver_1.MovieResolver, series_resolver_1.SeriesResolver],
    })
], MediaModule);
//# sourceMappingURL=media.module.js.map