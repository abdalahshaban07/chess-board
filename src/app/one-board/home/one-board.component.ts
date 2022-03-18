import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';
import { db, auth } from '../firebase/config';
import { ActivatedRoute, Router } from '@angular/router';
import { GameHistoryService } from 'src/app/services/game-history.service';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { map } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { origin } from 'src/app/services/message.service';

@Component({
  selector: 'app-one-board',
  templateUrl: './one-board.component.html',
  styleUrls: ['./one-board.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
  // providers: [AngularFirestore],
})
export class OneBoardComponent implements OnInit, OnDestroy {
  @ViewChild('board', { static: false }) board!: NgxChessBoardView;
  roomId!: string;
  isGameOver: boolean = false;
  gameSubject!: any;
  member: any;
  GameRef!: any;
  oponent!: any;
  currUser!: any;
  gameDoc!: any;
  winner!: string;
  origin = origin;
  gameDataObj!: any;
  constructor(
    private gameHistoryServ: GameHistoryService,
    private route: ActivatedRoute,
    private router: Router,
    private afs: AngularFirestore,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.roomId = this.route.snapshot.paramMap.get('roomId') as string;
    this.GameRef = doc(db, 'games', this.roomId);
    this.getGameInfo();
  }

  async getGameInfo() {
    const docSnap = await getDoc(this.GameRef);

    //check if the game is exist
    if (docSnap.exists()) {
      const data = docSnap.data();
      await this.handleJoinGame(data);
    } else {
      //if the game is not found ==> got to the one game to create a new game
      alert('game not found');
      this.router.navigate(['/one']);
    }
  }

  async handleJoinGame(docSnap: any) {
    const { status, members } = docSnap;
    const creator = members.find((m: any) => m.creator === true);

    //check if the user is the creator of the game
    if (status === 'waiting' && creator.uid !== auth.currentUser?.uid) {
      this.currUser = {
        uid: auth.currentUser?.uid,
        name: localStorage.getItem('userName'),
        piece: creator.piece === 'w' ? 'b' : 'w',
        reverse: true,
      };

      const updatedMembers = [...members, this.currUser];
      await updateDoc(this.GameRef, {
        members: updatedMembers,
        status: 'ready',
      });
    } else if (
      !members.map((m: any) => m.uid).includes(auth.currentUser?.uid)
    ) {
      alert('You are not part of this game');
      this.router.navigate(['/one']);
    }
    this.board.reset();
    this.trackChanges();
  }
  // @HostListener('window:beforeunload', ['$event'])
  // beforeUnload(event: BeforeUnloadEvent): void {
  //   //before closing the window ,store the game state in the local storage
  //   this.gameHistoryServ.setItem(
  //     'gameHistoryOneBoard',
  //     this.board.getMoveHistory() as []
  //   );
  // }

  trackChanges() {
    this.gameDoc = this.afs
      .collection('games')
      .doc(this.roomId)
      .valueChanges()
      .pipe(
        map((gameDoc: any) => {
          this.gameDataObj = gameDoc;
          const { winner, isGameOver, gameData } = gameDoc;
          this.member = this.gameDataObj?.members.find(
            (m: any) => m.uid === auth.currentUser?.uid
          );
          this.oponent = this.gameDataObj?.members.find(
            (m: any) => m.uid !== auth.currentUser?.uid
          );

          if (gameData) {
            this.board.setFEN(gameData);
          }
          if (isGameOver) {
            this.mangeAlert(`${winner} won the game`);
          }
          if (this.oponent?.reverse && this.oponent?.piece === 'b') {
            this.board.reverse();
          }
        })
      )
      .subscribe();
  }

  lightDisabled() {
    // console.log(this.gameDataObj);

    return (
      (this.member?.piece === 'b' && this.oponent?.piece !== 'b') ||
      this.gameDataObj?.status === 'waiting'
    );
  }

  darkDisabled() {
    return (
      (this.member?.piece === 'w' && this.oponent?.piece !== 'w') ||
      this.gameDataObj?.status === 'waiting'
    );
  }

  async captureMove(move: any) {
    //upadate the game state in the firebase
    await updateDoc(this.GameRef, {
      gameData: this.board.getFEN(),
    });

    if (move.checkmate) {
      this.handleGameOver(move);
    }
  }

  async handleGameOver(move: any) {
    this.isGameOver = true;

    this.winner =
      move.color.at(0) === this.member?.piece
        ? this.member?.name
        : this.oponent?.name;

    await updateDoc(this.GameRef, {
      gameData: this.board.getFEN(),
      isGameOver: this.isGameOver,
      winner: this.winner,
    });
  }

  mangeAlert(message: string) {
    alert(message);
    return false;
  }

  async resetGame() {
    this.board.reset();
    this.isGameOver = false;
    this.winner = '';

    await updateDoc(this.GameRef, {
      gameData: this.board.getFEN(),
      isGameOver: this.isGameOver,
      winner: this.winner,
    });
  }

  showCopyLink(): boolean {
    return this.member?.creator && this.member?.uid === auth.currentUser?.uid;
  }

  copyId() {
    navigator.clipboard
      .writeText(this.roomId)
      .then()
      .catch((e) => console.error(e));
  }

  ngOnDestroy(): void {
    this.gameDoc?.unsubscribe();
  }
}
