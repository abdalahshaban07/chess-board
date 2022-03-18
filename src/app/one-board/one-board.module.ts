import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OneBoardRoutingModule } from './one-board-routing.module';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { firebaseConfig } from './firebase/config';
import { AngularFireModule } from '@angular/fire/compat';
import { WelcomeComponent } from './welcome/welcome.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectModalComponent } from './select-modal/select-modal.component';
import { OneBoardComponent } from './home/one-board.component';
import { ShareModule } from '../shared/share.module';

@NgModule({
  declarations: [OneBoardComponent, WelcomeComponent, SelectModalComponent],
  imports: [
    CommonModule,
    OneBoardRoutingModule,
    NgxChessBoardModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth()),
    ReactiveFormsModule,
    ShareModule,
  ],
})
export class OneBoardModule {}
