export declare class UtilsController {
    private readonly logger;
    constructor();
    getColorsFromImage(imagePath: string): Promise<{
        dominantColor: string;
    }>;
}
