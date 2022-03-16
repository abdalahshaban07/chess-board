import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OneBoardRoutingModule } from './one-board-routing.module';
import { OneBoardComponent } from './one-board.component';
import { NgxChessBoardModule } from 'ngx-chess-board';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from './firebase/config';
import { AngularFireModule } from '@angular/fire/compat';
import { WelcomeComponent } from './welcome/welcome.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [OneBoardComponent, WelcomeComponent],
  imports: [
    CommonModule,
    OneBoardRoutingModule,
    NgxChessBoardModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    ReactiveFormsModule,
  ],
})
export class OneBoardModule {}
