import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TwoBoardRoutingModule } from './two-board-routing.module';
import { HomeComponent } from './home/home.component';
import { Player1Component } from './player1/player1.component';
import { Player2Component } from './player2/player2.component';
import { NgxChessBoardModule } from 'ngx-chess-board';

@NgModule({
  imports: [CommonModule, TwoBoardRoutingModule, NgxChessBoardModule.forRoot()],
  declarations: [HomeComponent, Player1Component, Player2Component],
})
export class TwoBoardModule {}
