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
} from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Move, Player1Component } from '../player1/player1.component';
import { GameHistoryService } from '../../services/game-history.service';
import { MessageService } from '../../services/message.service';
import { Player2Component } from '../player2/player2.component';

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
    private resolver: ComponentFactoryResolver
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
    confirm('Are you sure you want to leave?');
    //before closing the window ,store the game state in the local storage
    this.gameHistoryServ.setItem(this.moveFromPlayer?.moveHistory);
  }

  ngOnInit(): void {
    this.onStartGame();
  }

  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.createAndEmbedComponent();
    });
  }

  private createAndEmbedComponent(): void {
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
    this.iFrame1Url = this.sanitizer.bypassSecurityTrustResourceUrl('/player1');
    this.iFrame2Url = this.sanitizer.bypassSecurityTrustResourceUrl('/player2');
  }

  showAlert(): void {
    this.winner = this.moveFromPlayer.winner;
    alert(`${this.winner} wins!`);
  }
  resetGame(): void {
    this.winner = undefined;
    this.moveFromPlayer.gameEnd = false;
    this.messageServ.resetGame();
  }
}
