import { Controller, Get, Query, Logger } from '@nestjs/common';
import axios from 'axios';
import sharp from 'sharp';

@Controller('api')
export class UtilsController {
  private readonly logger = new Logger(UtilsController.name);

  constructor() {}

  @Get('colors')
  async getColorsFromImage(@Query('path') imagePath: string) {
    const fallback = { dominantColor: '#141414' };
    if (!imagePath || imagePath === 'null' || imagePath === 'undefined') {
      return fallback;
    }
    const imageUrl = `https://image.tmdb.org/t/p/w92${imagePath}`;
    try {
      const response = await axios.get(imageUrl, {
        responseType: 'arraybuffer',
      });
      const imageBuffer = Buffer.from(response.data);
      const stats = await sharp(imageBuffer).stats();
      const { r, g, b } = stats.dominant;
      const dominantColor = `rgb(${r}, ${g}, ${b})`;
      return { dominantColor };
    } catch (err) {
      this.logger.error(
        `Failed to get colors for path ${imagePath}. URL: ${imageUrl}`,
        err.message,
      );
      return fallback;
    }
  }
}
