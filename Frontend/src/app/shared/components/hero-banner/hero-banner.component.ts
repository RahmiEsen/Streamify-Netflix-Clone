import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  Input,
  Renderer2,
  SimpleChanges,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroMetaComponent } from './hero-meta/hero-meta.component';
import { AgeRatingComponent } from './age-rating/age-rating.component';
import { Movie } from '../../../core/models/movie.model';
import { FastAverageColor } from 'fast-average-color';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, HeroMetaComponent, AgeRatingComponent],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss',
})
/* AfterViewInit, OnDestroy */
export class HeroBannerComponent implements OnChanges {
  @Input() heroMovie: Movie | null = null;
  /* @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>; */
  isMuted = true;
  videoEnded = false;

  private fac = new FastAverageColor();
  /* private isAudioFading = false;
  private fadeOutInterval: any;
  private readonly AUDIO_FADE_START_TIME = 2;
  private readonly VIDEO_FADE_START_TIME = 0.5; */

  constructor(
    private http: HttpClient,
    private renderer: Renderer2,
    private elementRef: ElementRef,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['heroMovie'] && this.heroMovie) {
      const fullImageUrl = this.heroMovie.imageSet?.heroBackdropUrlDesktop;
      if (fullImageUrl) {
        const imagePath = fullImageUrl.substring(fullImageUrl.lastIndexOf('/'));
        this.applyGradientFromBackend(imagePath);
      } else {
        this.setBackgroundStyle('linear-gradient(to top, #141414, #181818)');
      }
    }
  }

  private applyGradientFromBackend(path: string): void {
    this.http
      .get<{
        dominantColor: string;
      }>(`http://localhost:3000/api/colors?path=${path}`)
      .subscribe((colorResult) => {
        const background = `${colorResult.dominantColor}`;
        this.setBackgroundStyle(background);
      });
  }

  private setBackgroundStyle(style: string): void {
    const mainElement = this.elementRef.nativeElement.querySelector('main');
    if (mainElement) {
      this.renderer.setStyle(mainElement, 'background', style);
    }
  }

  /* ngAfterViewInit(): void {
    this.videoPlayer.nativeElement.muted = this.isMuted;
    this.videoPlayer.nativeElement.addEventListener(
      'ended',
      this.onVideoEnded.bind(this),
    );
    this.videoPlayer.nativeElement.addEventListener(
      'timeupdate',
      this.onTimeUpdate.bind(this),
    );
  }

  ngOnDestroy(): void {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      this.videoPlayer.nativeElement.removeEventListener(
        'ended',
        this.onVideoEnded.bind(this),
      );
      this.videoPlayer.nativeElement.removeEventListener(
        'timeupdate',
        this.onTimeUpdate.bind(this),
      );
    }
    clearInterval(this.fadeOutInterval);
  }

  onTimeUpdate(): void {
    const video = this.videoPlayer.nativeElement;
    if (!video.duration) return;
    const timeRemaining = video.duration - video.currentTime;
    if (timeRemaining <= this.VIDEO_FADE_START_TIME && !this.videoEnded) {
      this.videoEnded = true;
    }
    if (
      timeRemaining <= this.AUDIO_FADE_START_TIME &&
      !this.isMuted &&
      !this.isAudioFading
    ) {
      this.isAudioFading = true;
      this.startAudioFadeOut(timeRemaining * 1000);
    }
  }

  onVideoEnded(): void {
    this.videoEnded = true;
    clearInterval(this.fadeOutInterval);
    this.videoPlayer.nativeElement.volume = 0;
  }

  startAudioFadeOut(duration: number): void {
    const video = this.videoPlayer.nativeElement;
    const startVolume = video.volume;
    const steps = 50;
    let currentStep = 0;
    this.fadeOutInterval = setInterval(() => {
      if (currentStep < steps) {
        video.volume = startVolume * (1 - currentStep / steps);
        currentStep++;
      } else {
        clearInterval(this.fadeOutInterval);
        this.fadeOutInterval = null;
        video.volume = 0;
      }
    }, duration / steps);
  }

  handleButtonClick(): void {
    if (this.videoEnded) {
      this.replayVideo();
    } else {
      this.toggleMute();
    }
  }

  toggleMute(): void {
    this.isMuted = !this.isMuted;
    this.videoPlayer.nativeElement.muted = this.isMuted;
    if (!this.isMuted) {
      this.videoPlayer.nativeElement.volume = 1;
      this.isAudioFading = false;
      clearInterval(this.fadeOutInterval);
      this.fadeOutInterval = null;
    }
  }

  replayVideo(): void {
    this.videoEnded = false;
    this.isAudioFading = false;
    this.videoPlayer.nativeElement.volume = 1;
    this.isMuted = false;
    this.videoPlayer.nativeElement.muted = false;
    this.videoPlayer.nativeElement.currentTime = 0;
    this.videoPlayer.nativeElement.play();
    clearInterval(this.fadeOutInterval);
    this.fadeOutInterval = null;
  }*/

  get buttonIcon(): string {
    if (this.videoEnded) {
      return 'replay.svg';
    }
    return this.isMuted ? 'volume-off.svg' : 'volume-on.svg';
  }
}
