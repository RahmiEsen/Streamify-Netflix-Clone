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
exports.Series = void 0;
const graphql_1 = require("@nestjs/graphql");
const typeorm_1 = require("typeorm");
const media_entity_1 = require("./media.entity");
let Series = class Series extends media_entity_1.Media {
    numberOfSeasons;
};
exports.Series = Series;
__decorate([
    (0, graphql_1.Field)(() => graphql_1.Int, { description: 'The total number of seasons.' }),
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Series.prototype, "numberOfSeasons", void 0);
exports.Series = Series = __decorate([
    (0, graphql_1.ObjectType)({ implements: () => [media_entity_1.Media] }),
    (0, typeorm_1.ChildEntity)('series')
], Series);
//# sourceMappingURL=series.entity.js.map