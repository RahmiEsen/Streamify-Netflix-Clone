import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { HeroMetaComponent } from './hero-meta/hero-meta.component';
import { AgeRatingComponent } from './age-rating/age-rating.component';

@Component({
  selector: 'app-hero-banner',
  standalone: true,
  imports: [CommonModule, HeroMetaComponent, AgeRatingComponent],
  templateUrl: './hero-banner.component.html',
  styleUrl: './hero-banner.component.scss',
})
export class HeroBannerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;
  isMuted = false;
  videoEnded = false;
  private isAudioFading = false;
  private fadeOutInterval: any;
  private readonly AUDIO_FADE_START_TIME = 2;
  private readonly VIDEO_FADE_START_TIME = 0.5;

  ngAfterViewInit(): void {
    this.videoPlayer.nativeElement.muted = this.isMuted;
    this.videoPlayer.nativeElement.addEventListener('ended', this.onVideoEnded.bind(this));
    this.videoPlayer.nativeElement.addEventListener('timeupdate', this.onTimeUpdate.bind(this));
  }

  ngOnDestroy(): void {
    if (this.videoPlayer && this.videoPlayer.nativeElement) {
      this.videoPlayer.nativeElement.removeEventListener('ended', this.onVideoEnded.bind(this));
      this.videoPlayer.nativeElement.removeEventListener(
        'timeupdate',
        this.onTimeUpdate.bind(this)
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
    if (timeRemaining <= this.AUDIO_FADE_START_TIME && !this.isMuted && !this.isAudioFading) {
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
  }

  get buttonIcon(): string {
    if (this.videoEnded) {
      return 'replay.svg';
    }
    return this.isMuted ? 'volume-off.svg' : 'volume-on.svg';
  }
}
