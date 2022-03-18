import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
  AfterViewInit,
  ViewContainerRef,
  ComponentFactoryResolver,
  ComponentRef,
  ViewChild,
  ElementRef,
  SecurityContext,
} from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Move, Player1Component } from '../player1/player1.component';
import { GameHistoryService } from '../../services/game-history.service';
import { MessageService } from '../../services/message.service';
import { Player2Component } from '../player2/player2.component';
import { ToastService } from 'src/app/services/toast.service';
import { ToastClass } from 'src/app/one-board/interfaces/Toast.Enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit, AfterViewInit {
  iFrame1Url!: SafeResourceUrl;
  iFrame2Url!: SafeResourceUrl;
  displayIFrame: boolean = false;
  moveFromPlayer!: Move;
  winner!: string | undefined;

  @ViewChild('player1IFrame', { static: true }) frame1!: ElementRef;
  @ViewChild('player2IFrame', { static: true }) frame2!: ElementRef;

  constructor(
    private sanitizer: DomSanitizer,
    private messageServ: MessageService,
    private gameHistoryServ: GameHistoryService,
    private vcRef: ViewContainerRef,
    private resolver: ComponentFactoryResolver,
    private toastService: ToastService
  ) {}

  @HostListener('window:message', ['$event'])
  onMessage(e: MessageEvent): void {
    this.moveFromPlayer = e.data;
    this.messageServ.sendFromMain(this.moveFromPlayer);
    setTimeout(() => {
      if (this.moveFromPlayer?.gameEnd) {
        this.showAlert();
      }
    }, 300);
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload(event: BeforeUnloadEvent): void {
    //before closing the window ,store the game state in the local storage
    this.gameHistoryServ.setItem(
      'gameHistory',
      this.moveFromPlayer?.moveHistory
    );
  }

  ngOnInit(): void {
    this.onStartGame();
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      // this.createAndEmbedComponent();
    });
  }

  createAndEmbedComponent(): void {
    //  resolves component
    const componentFactory1 =
      this.resolver.resolveComponentFactory(Player1Component);
    const componentFactory2 =
      this.resolver.resolveComponentFactory(Player2Component);

    //  creates component instance
    const componentInstance1: ComponentRef<Player1Component> =
      this.vcRef.createComponent(componentFactory1);
    const componentInstance2: ComponentRef<Player2Component> =
      this.vcRef.createComponent(componentFactory2);

    //  targets the <iframe>
    const frame1 =
      this.frame1.nativeElement.contentDocument ||
      this.frame1.nativeElement.contentWindow;

    const frame2 =
      this.frame2.nativeElement.contentDocument ||
      this.frame2.nativeElement.contentWindow;

    //  appends component to <body> of <iframe>
    frame1.body.appendChild(componentInstance1.location.nativeElement);
    frame2.body.appendChild(componentInstance2.location.nativeElement);
  }

  onStartGame(): void {
    this.displayIFrame = true;
    // this.iFrame1Url = this.sanitizer.bypassSecurityTrustResourceUrl('/player1');
    // this.iFrame2Url = this.sanitizer.bypassSecurityTrustResourceUrl('/player2');
    this.iFrame1Url = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.sanitizer.sanitize(SecurityContext.URL, 'player1') as string
    );
    this.iFrame2Url = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.sanitizer.sanitize(SecurityContext.URL, 'player2') as string
    );
  }

  showAlert(): void {
    this.winner = this.moveFromPlayer.winner;
    this.toastService.show(`${this.winner} wins!`, {
      classname: `bg-${ToastClass.Success} text-light`,
      delay: 3000,
      autohide: true,
    });
  }
  resetGame(): void {
    this.winner = undefined;
    this.moveFromPlayer.gameEnd = false;
    this.messageServ.resetGame();
  }
}
