import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
  ElementRef,
  AfterViewInit,
  HostListener,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MovieCardComponent } from '../../movie-card/movie-card.component';
import { Movie } from '../../../../core/models/movie.model';

@Component({
  selector: 'app-slider-control',
  standalone: true,
  imports: [CommonModule, MovieCardComponent],
  templateUrl: './slider-control.component.html',
  styleUrls: ['./slider-control.component.scss'],
})
export class SliderControlComponent implements OnChanges, AfterViewInit {
  @Input() items: Movie[] = [];
  @Output() rowHoverStateChange = new EventEmitter<boolean>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pagesInitialized = new EventEmitter<number>();

  itemsPerPage = 6;
  displayItems: Movie[] = [];
  showPrevButton = false;
  transform = '';
  transitionEnabled = true;

  isSliderActive = false;
  private currentPage = 0;
  private totalPages = 0;
  private currentIndex = 0;
  private originalItemCount = 0;
  private isTransitioning = false;

  constructor(
    private elementRef: ElementRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  @HostListener('window:resize')
  onResize(): void {
    this.updateItemsPerPage();
    this.reinitializeSlider();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateItemsPerPage();
      this.reinitializeSlider();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['items'] && this.items.length > 0) {
      this.reinitializeSlider();
    }
  }

  private reinitializeSlider(): void {
    if (!this.items || this.items.length === 0) return;
    this.originalItemCount = this.items.length;
    this.totalPages = Math.ceil(this.originalItemCount / this.itemsPerPage);
    this.isSliderActive = false;
    this.showPrevButton = false;
    this.currentIndex = 0;
    this.currentPage = 0;
    this.setupInitialDisplayItems();
    this.updateTransform();
    this.pagesInitialized.emit(this.totalPages);
    this.pageChange.emit(this.currentPage);
  }

  private updateItemsPerPage(): void {
    if (isPlatformBrowser(this.platformId)) {
      // <-- HIER IST DIE LÖSUNG
      const visibleItems = getComputedStyle(this.elementRef.nativeElement).getPropertyValue(
        '--visible'
      );
      this.itemsPerPage = parseInt(visibleItems, 10) || 6;
    }
  }

  private setupInitialDisplayItems(): void {
    const clonesAtEnd = this.items.slice(0, this.itemsPerPage);
    this.displayItems = [...this.items, ...clonesAtEnd];
  }

  private setupFullDisplayItems(): void {
    const clonesAtStart = this.items.slice(-this.itemsPerPage);
    const clonesAtEnd = this.items.slice(0, this.itemsPerPage);
    this.displayItems = [...clonesAtStart, ...this.items, ...clonesAtEnd];
  }

  scrollLeft(): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.currentIndex -= this.itemsPerPage;
    this.updateTransform();
    this.currentPage--;
    if (this.currentPage < 0) {
      this.currentPage = this.totalPages - 1;
    }
    this.pageChange.emit(this.currentPage);
  }

  scrollRight(): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    if (!this.isSliderActive) {
      this.isSliderActive = true;
      this.showPrevButton = true;
      this.setupFullDisplayItems();
      this.currentIndex = this.itemsPerPage * 2;
    } else {
      this.currentIndex += this.itemsPerPage;
    }
    this.updateTransform();
    this.currentPage++;
    if (this.currentPage >= this.totalPages) {
      this.currentPage = 0;
    }
    this.pageChange.emit(this.currentPage);
  }

  onTransitionEnd(): void {
    if (this.currentIndex >= this.originalItemCount + this.itemsPerPage) {
      this.resetToRealStart();
    } else if (this.currentIndex < this.itemsPerPage && this.isSliderActive) {
      this.resetToRealEnd();
    } else {
      this.isTransitioning = false;
    }
  }

  private updateTransform(): void {
    const itemWidthPercent = 100 / this.itemsPerPage;
    this.transform = `translate3d(-${this.currentIndex * itemWidthPercent}%, 0, 0)`;
  }

  private resetToRealStart(): void {
    this.transitionEnabled = false;
    this.currentIndex = this.itemsPerPage;
    this.updateTransform();
    this.currentPage = 0;
    this.pageChange.emit(this.currentPage);
    setTimeout(() => {
      this.transitionEnabled = true;
      this.isTransitioning = false;
    });
  }

  private resetToRealEnd(): void {
    this.transitionEnabled = false;
    this.currentIndex = this.originalItemCount;
    this.updateTransform();
    this.currentPage = this.totalPages - 1;
    this.pageChange.emit(this.currentPage);
    setTimeout(() => {
      this.transitionEnabled = true;
      this.isTransitioning = false;
    });
  }

  private getRealIndex(index: number): number {
    return this.isSliderActive ? index - this.itemsPerPage : index;
  }

  isFirst(index: number): boolean {
    const realIndex = this.getRealIndex(index);
    return realIndex >= 0 && realIndex % this.originalItemCount === 0;
  }

  isLast(index: number): boolean {
    const realIndex = this.getRealIndex(index);
    return realIndex >= 0 && realIndex % this.originalItemCount === this.originalItemCount - 1;
  }

  onCardHoverChange(isHovered: boolean): void {
    this.rowHoverStateChange.emit(isHovered);
  }
}
