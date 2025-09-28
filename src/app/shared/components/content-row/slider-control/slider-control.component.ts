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
  ContentChild,
  TemplateRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-slider-control',
  standalone: true,
  imports: [CommonModule, ScrollingModule],
  templateUrl: './slider-control.component.html',
  styleUrls: ['./slider-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SliderControlComponent implements OnChanges, AfterViewInit {
  @Input() items: any[] = [];
  @Input() scrollMode: 'default' | 'ranked' = 'default';
  @Output() rowHoverStateChange = new EventEmitter<boolean>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pagesInitialized = new EventEmitter<number>();
  @ContentChild('itemTemplate') itemTemplateRef!: TemplateRef<any>;

  itemsPerPage = 6;
  displayItems: any[] = [];
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
    this.updateItemsPerPage();
    this.reinitializeSlider();
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

    Promise.resolve().then(() => {
      this.pagesInitialized.emit(this.totalPages);
    });
    this.pageChange.emit(this.currentPage);
  }

  private updateItemsPerPage(): void {
    if (isPlatformBrowser(this.platformId)) {
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
    if (this.scrollMode === 'ranked') {
      this.scrollLeftRanked();
    } else {
      this.scrollLeftDefault();
    }
    this.updateTransform();
    this.currentPage--;
    if (this.currentPage < 0) {
      this.currentPage = this.totalPages - 1;
    }
    this.pageChange.emit(this.currentPage);
  }

  private scrollLeftRanked(): void {
    if (this.currentPage === 1) {
      this.currentIndex = this.itemsPerPage;
    } else {
      this.currentIndex -= this.itemsPerPage;
    }
  }

  private scrollLeftDefault(): void {
    this.currentIndex -= this.itemsPerPage;
  }

  scrollRight(): void {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    const isFirstScroll = !this.isSliderActive;
    if (isFirstScroll) {
      this.isSliderActive = true;
      this.showPrevButton = true;
      this.setupFullDisplayItems();
    }
    if (this.scrollMode === 'ranked') {
      this.scrollRightRanked();
    } else {
      this.scrollRightDefault(isFirstScroll);
    }
    this.updateTransform();
    this.updatePage();
  }

  private scrollRightDefault(isFirstScroll: boolean): void {
    if (isFirstScroll) {
      this.currentIndex = this.itemsPerPage * 2;
    } else {
      this.currentIndex += this.itemsPerPage;
    }
  }

  private scrollRightRanked(): void {
    if (this.currentPage === 0) {
      this.currentIndex = 4 + this.itemsPerPage;
    } else {
      this.currentIndex += this.itemsPerPage;
    }
  }

  private updatePage(): void {
    this.currentPage++;
    if (this.currentPage >= this.totalPages) {
      this.currentPage = 0;
    }
    this.pageChange.emit(this.currentPage);
  }

  onTransitionEnd(): void {
    this.isTransitioning = false;
    if (this.currentIndex >= this.originalItemCount + this.itemsPerPage) {
      this.resetToRealStart();
    } else if (this.currentIndex < this.itemsPerPage && this.isSliderActive) {
      this.resetToRealEnd();
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
    });
  }

  isFirst(index: number): boolean {
    return index === this.currentIndex;
  }

  isLast(index: number): boolean {
    return index === this.currentIndex + this.itemsPerPage - 1;
  }

  onCardHoverChange(isHovered: boolean): void {
    this.rowHoverStateChange.emit(isHovered);
  }
}
