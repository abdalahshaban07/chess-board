import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ViewChild,
  HostListener,
} from '@angular/core';
import { MoveChange, NgxChessBoardView } from 'ngx-chess-board';
import { GameHistoryService } from '../services/game-history.service';
import { Move } from '../two-board/player1/player1.component';
import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-one-board',
  templateUrl: './one-board.component.html',
  styleUrls: ['./one-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [AngularFirestore],
})
export class OneBoardComponent implements OnInit {
  @ViewChild('board', { static: true }) board!: NgxChessBoardView;
  gameEnd!: boolean;
  roomId!: string;
  constructor(
    private gameHistoryServ: GameHistoryService,
    private firestore: Firestore,
    private afs: AngularFirestore,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('roomId') as string;

    let moveHistory = this.gameHistoryServ.getItem('gameHistoryOneBoard');
    moveHistory.forEach((move: Move) => {
      this.board.move(move.move);
    });
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnload(event: BeforeUnloadEvent): void {
    //before closing the window ,store the game state in the local storage
    this.gameHistoryServ.setItem(
      'gameHistoryOneBoard',
      this.board.getMoveHistory() as []
    );
  }

  captureMove(move: any): void {
    if (move.checkmate) {
      if (move.color === 'white') {
        alert('Player 1 win');
      } else {
        alert('Player 2 win');
      }
    }
  }

  resetGame(): void {
    this.board.reset();
  }

  copyId() {
    //get the id of the game from url
    navigator.clipboard
      .writeText(this.roomId)
      .then()
      .catch((e) => console.error(e));
  }
}
