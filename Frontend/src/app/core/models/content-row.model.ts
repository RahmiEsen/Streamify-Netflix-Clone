import { Media } from './media.model';
import { RankedItem } from './ranked-item.model';

export interface ContentRow {
  rowTitle: string;
  items: (Media | RankedItem)[];
  displayMode?: 'default' | 'ranked';
}
