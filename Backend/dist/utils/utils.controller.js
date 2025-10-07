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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var UtilsController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsController = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = __importDefault(require("axios"));
const sharp_1 = __importDefault(require("sharp"));
let UtilsController = UtilsController_1 = class UtilsController {
    logger = new common_1.Logger(UtilsController_1.name);
    constructor() { }
    async getColorsFromImage(imagePath) {
        const fallback = { dominantColor: '#141414' };
        if (!imagePath || imagePath === 'null' || imagePath === 'undefined') {
            return fallback;
        }
        const imageUrl = `https://image.tmdb.org/t/p/w92${imagePath}`;
        try {
            const response = await axios_1.default.get(imageUrl, {
                responseType: 'arraybuffer',
            });
            const imageBuffer = Buffer.from(response.data);
            const stats = await (0, sharp_1.default)(imageBuffer).stats();
            const { r, g, b } = stats.dominant;
            const dominantColor = `rgb(${r}, ${g}, ${b})`;
            return { dominantColor };
        }
        catch (err) {
            this.logger.error(`Failed to get colors for path ${imagePath}. URL: ${imageUrl}`, err.message);
            return fallback;
        }
    }
};
exports.UtilsController = UtilsController;
__decorate([
    (0, common_1.Get)('colors'),
    __param(0, (0, common_1.Query)('path')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UtilsController.prototype, "getColorsFromImage", null);
exports.UtilsController = UtilsController = UtilsController_1 = __decorate([
    (0, common_1.Controller)('api'),
    __metadata("design:paramtypes", [])
], UtilsController);
//# sourceMappingURL=utils.controller.js.map