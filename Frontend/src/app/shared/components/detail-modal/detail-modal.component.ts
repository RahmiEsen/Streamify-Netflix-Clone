import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
} from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Movie } from '../../../core/models/movie.model';
import { ActionButtonComponent } from '../buttons/action-button/action-button.component';
import { IconButtonComponent } from '../buttons/icon-button/icon-button.component';
import { RatingButtonsComponent } from '../buttons/rating-buttons/rating-buttons.component';

export interface OpenModalPayload {
  movie: Movie;
  originBounds: DOMRect;
}

@Component({
  selector: 'app-detail-modal',
  standalone: true,
  imports: [CommonModule, ActionButtonComponent, IconButtonComponent, RatingButtonsComponent],
  templateUrl: './detail-modal.component.html',
  styleUrl: './detail-modal.component.scss',
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({
          top: '{{startTop}}px',
          left: '{{startLeft}}px',
          width: '{{startWidth}}px',
          transform: 'scale(0.2)',
        }),
        animate(
          '550ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({
            top: '3em',
            left: '50%',
            width: '850px',
            transform: 'scale(1) translateX(-50%)',
          })
        ),
      ]),
      transition(':leave', [
        animate(
          '500ms cubic-bezier(0.4, 0.0, 0.2, 1)',
          style({
            top: '{{startTop}}px',
            left: '{{startLeft}}px',
            width: '{{startWidth}}px',
            transform: 'scale(0.2)',
          })
        ),
      ]),
    ]),
    trigger('overlayAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('350ms ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [animate('300ms ease-in', style({ opacity: 0 }))]),
    ]),
  ],
})
export class DetailModalComponent implements AfterViewInit, OnDestroy {
  @Input({ required: true }) modalPayload!: OpenModalPayload;
  @Output() closeModal = new EventEmitter<void>();
  @ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  videoEnded = false;
  isMuted = true;
  isOpen = false;

  seasons = [
    { number: 1, episodeCount: 12 },
    { number: 2, episodeCount: 12 },
    { number: 3, episodeCount: 12 },
    { number: 4, episodeCount: 12 },
    { number: 5, episodeCount: 12 },
    { number: 6, episodeCount: 12 },
    { number: 7, episodeCount: 12 },
    { number: 8, episodeCount: 12 },
  ];

  episodes = [
    {
      number: 1,
      title: 'Dexter',
      duration: '53 Min.',
      description:
        'Dexter Morgan, ein Forensiker, der ein Doppelleben als Killer von nicht verurteilten Kriminellen führt, ist von der Arbeit eines neuen Serienmörders beeindruckt.',
      thumbnailUrl: 'assets/thumbnail-test.webp',
    },
    {
      number: 2,
      title: 'Eiskalt erwischt',
      duration: '54 Min.',
      description:
        'Nachdem Dexter einen Mann ins Visier nimmt, der schon bald von einem Mord freigesprochen wird, erfährt er, dass der „Kühllaster-Killer“ von seinem Doppelleben weiß.',
      thumbnailUrl: 'assets/thumbnail-test.webp',
    },
    {
      number: 3,
      title: 'Cherry On Ice',
      duration: '50 Min.',
      description:
        'Als die Leiche eines weiteren Opfers des Kühllaster-Killers in einer Eishalle auftaucht, konzentriert LaGuerta alle Kräfte auf die Festnahme eines Wachpostens.',
      thumbnailUrl: 'assets/thumbnail-test.webp',
    },
    {
      number: 4,
      title: 'Mit Hand und Fuß',
      duration: '57 Min.',
      description:
        'Körperteile des neuesten Opfers des Kühllaster-Killers fangen an, überall in Miami aufzutauchen – durchwegs an Orten, die etwas mit Dexters Kindheit zu tun haben.',
      thumbnailUrl: 'assets/thumbnail-test.webp',
    },
    {
      number: 5,
      title: 'Das perfekte Paar',
      duration: '55 Min.',
      description:
        'Ein großer Erfolg für die Polizei in den Ermittlungen zum Kühllaster-Killer: Eines der Opfer wird lebend aufgefunden.',
      thumbnailUrl: 'assets/thumbnail-test.webp',
    },
    {
      number: 6,
      title: 'Ein Sturm zieht auf',
      duration: '52 Min.',
      description:
        'Als die Leiche von einem von Dexters Opfern wieder am Original-Tatort auftaucht, hat er den Kühllaster-Killer im Verdacht.',
      thumbnailUrl: 'assets/thumbnail-test.webp',
    },
    {
      number: 7,
      title: 'Freundeskreis',
      duration: '52 Min.',
      description:
        'Die Polizei glaubt, den Kühllaster-Killer identifiziert zu haben, doch Dexter ist sich da nicht so sicher.',
      thumbnailUrl: 'assets/thumbnail-test.webp',
    },
    {
      number: 8,
      title: 'Therapiestunden',
      duration: '53 Min.',
      description:
        'Eine Reihe von reichen Frauen haben offenbar Selbstmord begangen – doch Dexter denkt, dass sie von ihrem Therapeuten ermordet wurden.',
      thumbnailUrl: 'assets/thumbnail-test.webp',
    },
    {
      number: 9,
      title: 'Spuren der Vergangenheit',
      duration: '55 Min.',
      description:
        'Um alte Erinnerungen zu wecken, macht sich Dexter auf den Weg zum Haus seines kürzlich verstorbenen leiblichen Vaters.',
      thumbnailUrl: 'assets/thumbnail-test.webp',
    },
    {
      number: 10,
      title: 'Rot wie Blut',
      duration: '56 Min.',
      description:
        'Als Dexter einen blutigen Tatort untersuchen soll, kommen verdrängte Erinnerungen an seine Kindheit hoch.',
      thumbnailUrl: 'assets/thumbnail-test.webp',
    },
    {
      number: 11,
      title: 'Tödliche Weihnachten',
      duration: '53 Min.',
      description:
        'Kurz vor Weihnachten lässt der Kühllaster-Killer die Leiche einer Sexarbeiterin vor einem Weihnachtsmarkt zurück.',
      thumbnailUrl: 'assets/thumbnail-test.webp',
    },
    {
      number: 12,
      title: 'Blutsbrüder',
      duration: '56 Min.',
      description:
        'Während er dem fehlgeleiteten Sgt. Doakes aus dem Weg gehen muss, versucht Dexter, den echten Kühllaster-Killer und seine Geisel zu finden, bevor es zu spät ist.',
      thumbnailUrl: 'assets/thumbnail-test.webp',
    },
  ];

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  private _cachedAnimationParams: any;

  constructor(private cdr: ChangeDetectorRef) {}

  get animationParams() {
    if (this.modalPayload) {
      const bounds = this.modalPayload.originBounds;
      this._cachedAnimationParams = {
        value: this.modalPayload,
        params: {
          startTop: bounds.top,
          startLeft: bounds.left,
          startWidth: bounds.width,
        },
      };
      return this._cachedAnimationParams;
    }
    return this._cachedAnimationParams;
  }

  ngAfterViewInit(): void {
    const video = this.videoPlayer?.nativeElement;
    if (video) {
      video.muted = true;
      video.play().catch(() => console.error('Autoplay wurde blockiert.'));
      video.addEventListener('ended', this.onVideoEnded.bind(this));
    }
  }

  ngOnDestroy(): void {
    const video = this.videoPlayer?.nativeElement;
    if (video) {
      video.removeEventListener('ended', this.onVideoEnded.bind(this));
    }
  }

  private onVideoEnded(): void {
    this.videoEnded = true;
    this.cdr.detectChanges();
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
    const video = this.videoPlayer?.nativeElement;
    if (video) {
      this.videoEnded = false;
      video.currentTime = 0;
      video.play();
    }
  }

  onClose(): void {
    this.closeModal.emit();
  }
}
