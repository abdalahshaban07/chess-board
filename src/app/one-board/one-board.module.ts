import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OneBoardRoutingModule } from './one-board-routing.module';
import { OneBoardComponent } from './one-board.component';


@NgModule({
  declarations: [
    OneBoardComponent
  ],
  imports: [
    CommonModule,
    OneBoardRoutingModule
  ]
})
export class OneBoardModule { }
