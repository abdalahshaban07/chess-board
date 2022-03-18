import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { NgxChessBoardView } from 'ngx-chess-board';
import { db, auth } from '../firebase/config';
import { ActivatedRoute, Router } from '@angular/router';
import {
  arrayUnion,
  doc,
  DocumentReference,
  getDoc,
  onSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { origin } from 'src/app/services/message.service';
import { ToastService } from 'src/app/services/toast.service';
import { ToastClass } from '../interfaces/Toast.Enum';
import { Game } from '../interfaces/Game';
import { Member } from '../interfaces/Member';

@Component({
  selector: 'app-one-board',
  templateUrl: './one-board.component.html',
  styleUrls: ['./one-board.component.scss'],
})
export class OneBoardComponent implements OnInit, OnDestroy {
  @ViewChild('board', { static: false }) board!: NgxChessBoardView;
  roomId!: string;
  isGameOver: boolean = false;
  member!: Member;
  oponent!: Member;
  GameRef!: DocumentReference;
  gameDoc!: any;
  winner!: string | null;
  origin = origin;
  gameDataObj!: Game;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService
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
      const data = docSnap.data() as Game;
      await this.handleJoinGame(data);
    } else {
      //if the game is not found ==> got to the one game to create a new game
      this.showCustomToast('Room Not Found', ToastClass.Error, true);
      this.router.navigate(['/one']);
    }
  }

  async handleJoinGame(docSnap: Game) {
    const { status, members } = docSnap;
    const creator = members.find((m: any) => m.creator === true) as Member;
    //check if the user is the creator of the game
    if (status === 'waiting' && creator?.uid !== auth.currentUser?.uid) {
      await this.handleNewMember(creator, members);
    } else if (
      !members.map((m: any) => m.uid).includes(auth.currentUser?.uid)
    ) {
      this.showCustomToast(
        'You are not part of this game',
        ToastClass.Info,
        true
      );
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

  async handleNewMember(creator: Member, members: Member[]) {
    let currUser: Member = {
      uid: auth.currentUser?.uid as string,
      name: localStorage.getItem('userName') as string,
      piece: creator.piece === 'w' ? 'b' : 'w',
      reverse: creator.piece === 'w' ? true : false,
    };

    await updateDoc(this.GameRef, {
      members: arrayUnion(currUser),
      status: 'ready',
    });
  }

  trackChanges() {
    this.gameDoc = onSnapshot(this.GameRef, (doc: any) => {
      if (!doc.exists()) return;
      this.gameDataObj = doc.data() as Game;
      const { winner, isGameOver, gameData, members } = doc.data();
      this.member = members.find(
        (m: any) => m.uid === auth.currentUser?.uid
      ) as Member;
      this.oponent = members.find(
        (m: any) => m.uid !== auth.currentUser?.uid
      ) as Member;

      if (gameData) {
        this.board.setFEN(gameData);
      }

      if (isGameOver) {
        this.showCustomToast(
          `${winner} won the game`,
          ToastClass.Success,
          true,
          5000
        );
      }

      //handle board reverse
      if (this.handleReverse()) {
        this.board.reverse();
      }
    });
  }

  lightDisabled() {
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

    setTimeout(() => {
      this.resetGame();
    }, 5000);

    await updateDoc(this.GameRef, {
      gameData: this.board.getFEN(),
      isGameOver: this.isGameOver,
      winner: this.winner,
    });
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
    return (this.member?.creator &&
      this.member?.uid === auth.currentUser?.uid) as boolean;
  }

  copyId() {
    navigator.clipboard
      .writeText(this.roomId)
      .then()
      .catch((e) => console.error(e));
  }

  showCustomToast(
    customTpl: string,
    className: ToastClass,
    autohide: boolean = true,
    delay: number = 500
  ) {
    this.toastService.show(customTpl, {
      classname: `bg-${className} text-light`,
      delay,
      autohide,
    });
  }

  showUserName(): boolean {
    return this.member?.uid === auth.currentUser?.uid;
  }

  handleReverse(): boolean {
    let checkReverse = this.oponent?.reverse || this.member?.reverse;
    let checkColor =
      (this.oponent?.piece === 'b' && this.member?.piece === 'b') ||
      this.oponent?.piece === 'w';

    return checkColor;
  }

  ngOnDestroy(): void {
    this.gameDoc();
  }
}
