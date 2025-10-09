import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie, Series } from '../../../../core/models/media.model';
import { IconButtonComponent } from '../../buttons/icon-button/icon-button.component';
import { RatingButtonsComponent } from '../../buttons/rating-buttons/rating-buttons.component';
import { isMovie, isSeries } from '../../../../core/services/graphql.service';

@Component({
  selector: 'app-title-detail',
  standalone: true,
  imports: [CommonModule, IconButtonComponent, RatingButtonsComponent],
  templateUrl: './title-detail.component.html',
  styleUrl: './title-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleDetailComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) movie!: Movie | Series;
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  @Output() openModalRequest = new EventEmitter<void>();

  isVideoPlaying = false;
  isVideoFadingOut = false;
  isMuted = true;
  videoEnded = false;

  private onVideoEndedHandler: () => void;
  public isMovie = isMovie;
  public isSeries = isSeries;

  constructor(private cdr: ChangeDetectorRef) {
    this.onVideoEndedHandler = this.onVideoEnded.bind(this);
  }

  ngAfterViewInit(): void {
    this.playVideo();
  }

  ngOnDestroy(): void {
    const videoElement = this.videoPlayer?.nativeElement;
    if (videoElement) {
      videoElement.removeEventListener('ended', this.onVideoEndedHandler);
    }
  }

  private playVideo(): void {
    this.isVideoPlaying = true;
    this.cdr.detectChanges();
    const videoElement = this.videoPlayer?.nativeElement;
    if (videoElement) {
      videoElement.muted = this.isMuted;
      videoElement.addEventListener('ended', this.onVideoEndedHandler);
      videoElement.play().catch(() => {
        this.isVideoPlaying = false;
        this.cdr.detectChanges();
      });
    }
  }

  private onVideoEnded(): void {
    this.videoEnded = true;
    this.isVideoFadingOut = true;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.isVideoPlaying = false;
      this.isVideoFadingOut = false;
      this.cdr.detectChanges();
    }, 500);
  }

  get icon(): string {
    if (this.videoEnded) {
      return 'replay.svg';
    }
    return this.isMuted ? 'volume-off.svg' : 'volume-on.svg';
  }

  onButtonClick(): void {
    if (this.videoEnded) {
      this.replayVideo();
    } else {
      this.toggleMute();
    }
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    if (this.videoPlayer?.nativeElement) {
      this.videoPlayer.nativeElement.muted = this.isMuted;
    }
  }

  replayVideo(): void {
    const videoElement = this.videoPlayer?.nativeElement;
    if (videoElement) {
      this.videoEnded = false;
      this.isMuted = false;
      videoElement.muted = false;
      videoElement.currentTime = 0;
      videoElement.play();
    }
  }

  onRequestOpenModal(): void {
    this.openModalRequest.emit();
  }

  get formattedRuntime(): string {
    // Sicherstellen, dass es sich um einen Film handelt und duration existiert
    if (isMovie(this.movie) && this.movie.duration) {
      const hours = Math.floor(this.movie.duration / 60);
      const minutes = this.movie.duration % 60;
      return `${hours} Std. ${minutes} Min.`;
    }
    return ''; // Gib für Serien oder Filme ohne Laufzeit nichts zurück
  }

  get show3DAudio(): boolean {
    if (!this.movie?.release_date) {
      return false;
    }
    const releaseYear = new Date(this.movie.release_date).getFullYear();
    return releaseYear >= 2017;
  }
}
