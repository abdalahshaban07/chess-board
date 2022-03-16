import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StartComponent } from './start/start.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'start',
    pathMatch: 'full',
  },
  {
    path: 'start',
    component: StartComponent,
  },
  {
    path: 'two',
    loadChildren: () =>
      import('./two-board/two-board.module').then((m) => m.TwoBoardModule),
  },
  {
    path: 'one',
    loadChildren: () =>
      import('./one-board/one-board.module').then((m) => m.OneBoardModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
