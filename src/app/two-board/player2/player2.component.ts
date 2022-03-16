import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { HistoryMove, MoveChange, NgxChessBoardView } from 'ngx-chess-board';
import { Move } from '../player1/player1.component';
import { GameHistoryService } from '../../services/game-history.service';
import { origin } from '../../services/message.service';

@Component({
  selector: 'app-player2',
  templateUrl: './player2.component.html',
  styleUrls: ['./player2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.ShadowDom,
})
export class Player2Component implements OnInit {
  @ViewChild('board2', { static: true }) board!: NgxChessBoardView;
  moveFromPlayer1!: Move;
  moveHistory!: HistoryMove[];

  constructor(private gameHistoryServ: GameHistoryService) {}

  @HostListener('window:message', ['$event'])
  onMessage(e: MessageEvent) {
    this.moveFromPlayer1 = e.data;
    if (
      this.moveFromPlayer1.from !== 'main' &&
      this.moveFromPlayer1.color !== 'black' &&
      e.origin !== origin
    )
      return;
    else if (this.moveFromPlayer1.reset) {
      this.board.reset();
    } else {
      this.board.move(this.moveFromPlayer1.move);
    }
  }

  ngOnInit(): void {
    this.board.reverse();
    //get histor move from local storage
    this.moveHistory = this.gameHistoryServ.getItem('gameHistory');
    this.moveHistory.forEach((move) => {
      this.board.move(move.move);
    });
  }

  captureMove(move: MoveChange): void {
    this.moveHistory = this.board.getMoveHistory();
    if (move.checkmate) {
      window.parent.postMessage({ gameEnd: true, winner: 'player2' }, origin);
    } else {
      window.parent.postMessage(
        { moveHistory: this.moveHistory, ...move },
        origin
      );
    }
  }
}
