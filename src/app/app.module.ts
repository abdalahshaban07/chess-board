import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxChessBoardModule } from 'ngx-chess-board';
import { Player1Component } from './player1/player1.component';
import { Player2Component } from './player2/player2.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    Player1Component,
    Player2Component,
    HomeComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, NgxChessBoardModule.forRoot()],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
