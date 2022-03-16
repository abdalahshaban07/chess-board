import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { db } from '../firebase/config';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  getDocs,
  where,
  query,
  arrayUnion,
} from 'firebase/firestore';
import { Router } from '@angular/router';

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

  playersCollection!: AngularFirestoreCollection;
  roomsCollection!: AngularFirestoreCollection;
  constructor(
    private fb: FormBuilder,
    private afs: AngularFirestore,
    private router: Router
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
    this.newGameForm = true;
  }

  joinGame() {
    this.createJoinForm();
    this.showjoinForm = true;
  }

  async createGame() {
    if (!this.newGameform.valid) return;

    const { name } = this.newGameform.value;

    try {
      const { id: playerRef } = await addDoc(collection(db, 'players'), {
        name,
      });

      const { id: roomId } = await addDoc(collection(db, 'rooms'), {
        players: [playerRef],
      });

      // go to game
      this.router.navigate(['online', roomId]);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  }

  async joinAndStartGame() {
    if (!this.joinForm.valid) return;

    const { id: roomId, name } = this.joinForm.value;

    const roomRef = doc(db, 'rooms', roomId);
    const roomshot = await getDoc(roomRef);

    // if room is exist ==> check if room full ==> full ==> alert to create new game bec room full ==> else ==> add player to room ==> go to game
    // if room is not exist ==> alert user to create new game becaues room not exist

    if (roomshot.exists()) {
      const { players } = roomshot.data();
      //check if room full
      if (players.length >= 2) {
        alert('Room is full');
        return;
      }
      //add player to room
      try {
        const { id: playerRef } = await addDoc(collection(db, 'players'), {
          name,
        });

        await updateDoc(roomRef, {
          players: arrayUnion(playerRef),
        });
        // go to game
        this.router.navigate(['online', roomId]);
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    } else {
      alert('Room not exist please create new game');
    }
  }
}
