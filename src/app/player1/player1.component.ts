import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
} from '@angular/core';
import { MoveChange, NgxChessBoardView } from 'ngx-chess-board';

@Component({
  selector: 'app-player1',
  templateUrl: './player1.component.html',
  styleUrls: ['./player1.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Player1Component implements OnInit {
  @ViewChild('board', { static: false }) board!: NgxChessBoardView;

  ngOnInit(): void {}

  onClose(): void {
    const frame = window.parent.document.getElementById('player1IFrame');
    frame?.parentNode?.removeChild(frame);
  }

  captureMove(move: MoveChange): void {
    console.log({ move });
    //     check: false
    // checkmate: false
    // color: "white"
    // fen: "rnbqkbnr/pppppppp/8/8/8/4P3/PPPP1PPP/RNBQKBNR b KQkq - 0 1"
    // freeMode: false
    // mate: false
    // move: "e2e3"
    // pgn:
    // pgn: "1. e3"

    // piece: "Pawn"
    // stalemate: false
    // x: false
    // const frame = window.parent.document.getElementById(
    //   'player1IFrame'
    // ) as HTMLIFrameElement;
    // frame?.contentWindow?.postMessage(move, '*');
  }
}
