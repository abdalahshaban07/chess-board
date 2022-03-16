import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  HostListener,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { HistoryMove, MoveChange, NgxChessBoardView } from 'ngx-chess-board';
import { GameHistoryService } from '../../services/game-history.service';
import { origin } from '../../services/message.service';

export interface Move extends MoveChange {
  color: string;
  mate: boolean;
  move: string;
  from?: string;
  gameEnd?: false;
  winner?: string;
  reset?: boolean;
  moveHistory?: [];
}

@Component({
  selector: 'app-player1',
  templateUrl: './player1.component.html',
  styleUrls: ['./player1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  // encapsulation: ViewEncapsulation.ShadowDom,
})
export class Player1Component implements OnInit {
  @ViewChild('board1', { static: true }) board!: NgxChessBoardView;
  moveFromPlayer2!: Move;
  moveHistory: HistoryMove[] = [];

  constructor(private gameHistoryServ: GameHistoryService) {}

  @HostListener('window:message', ['$event'])
  onMessage(e: MessageEvent) {
    this.moveFromPlayer2 = e.data;
    if (
      this.moveFromPlayer2.from !== 'main' &&
      this.moveFromPlayer2.color !== 'white' &&
      e.origin !== origin
    )
      return;
    else if (this.moveFromPlayer2.reset) {
      this.board.reset();
    } else {
      this.board.move(e.data.move);
    }
  }

  ngOnInit(): void {
    //get histor move from local storage
    this.moveHistory = this.gameHistoryServ.getItem('gameHistory');
    this.moveHistory.forEach((move) => {
      this.board.move(move.move);
    });
  }

  captureMove(move: MoveChange): void {
    this.moveHistory = this.board.getMoveHistory();
    if (move.checkmate) {
      window.parent.postMessage({ gameEnd: true, winner: 'player1' }, origin);
    } else {
      window.parent.postMessage(
        { moveHistory: this.moveHistory, ...move },
        origin
      );
    }
  }
}
