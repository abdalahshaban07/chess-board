import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { db, auth } from '../firebase/config';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  arrayUnion,
  setDoc,
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SelectModalComponent } from '../select-modal/select-modal.component';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements OnInit {
  newGameForm: boolean = false;
  showjoinForm: boolean = false;
  newGameform!: FormGroup;
  joinForm!: FormGroup;

  pieceSelect!: string;

  playersCollection!: AngularFirestoreCollection;
  roomsCollection!: AngularFirestoreCollection;
  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private router: Router, // private auth: AngularFireAuth
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    // this.playersCollection = this.afs.collection('players');
    // this.roomsCollection = this.afs.collection('rooms');
  }

  createNewGameForm() {
    this.newGameform = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  createJoinForm() {
    this.joinForm = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', [Validators.required]],
    });
  }

  createNewGame() {
    this.createNewGameForm();
    this.showjoinForm = false;
    this.newGameForm = true;
  }

  joinGame() {
    this.createJoinForm();
    this.newGameForm = false;
    this.showjoinForm = true;
  }

  async createGame() {
    if (!this.newGameform.valid) return;
    const { name } = this.newGameform.value;
    localStorage.setItem('userName', name);
    try {
      await signInAnonymously(auth);
      this.open();
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }

  async joinAndStartGame() {
    if (!this.joinForm.valid) return;
    const { name, id } = this.joinForm.value;
    localStorage.setItem('userName', name);
    this.router.navigate(['online', id]);
    try {
      await signInAnonymously(auth);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }

  open() {
    const modalRef = this.modalService.open(SelectModalComponent);
    modalRef.componentInstance.name = 'select piece';
    modalRef.closed.subscribe((result) => {
      //"w" or "b"
      this.pieceSelect = result;
      this.startOnlineGame();
    });
  }

  async startOnlineGame() {
    const member = {
      uid: auth.currentUser?.uid,
      piece: this.pieceSelect,
      name: localStorage.getItem('userName'),
      creator: true,
      reverse: false,
    };

    const game = {
      status: 'waiting',
      members: [member],
      gameId: this.afs.createId(),
    };
    try {
      await setDoc(doc(db, 'games', game.gameId), game);
      this.router.navigate(['online', game.gameId]);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }
}
