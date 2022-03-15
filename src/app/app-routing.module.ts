import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { Player1Component } from './player1/player1.component';
import { Player2Component } from './player2/player2.component';

const routes: Routes = [
  {
    path: 'player1',
    component: Player1Component,
  },
  {
    path: 'player2',
    component: Player2Component,
  },
  {
    path: '**',
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
