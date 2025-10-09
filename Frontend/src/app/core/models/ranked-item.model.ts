import { Media } from './media.model';

export interface RankedItem {
  media: Media;
  rank: number;
  viewBox: string;
  pathD: string;
}
