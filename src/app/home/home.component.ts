import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
} from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';
import { Move } from '../player1/player1.component';
import { GameHistoryService } from '../services/game-history.service';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  iFrame1Url!: SafeResourceUrl;
  iFrame2Url!: SafeResourceUrl;
  displayIFrame: boolean = false;
  moveFromPlayer!: Move;
  winner!: string | undefined;

  constructor(
    private sanitizer: DomSanitizer,
    private messageServ: MessageService,
    private gameHistoryServ: GameHistoryService
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
  beforeUnload(event: Event): void {
    //before closing the window ,store the game state in the local storage
    this.gameHistoryServ.setItem(this.moveFromPlayer?.moveHistory);
    alert('before unload');
  }

  ngOnInit(): void {
    this.onStartGame();
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
