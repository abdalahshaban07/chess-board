import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OneBoardComponent } from './one-board.component';

const routes: Routes = [
  {
    path: '',
    component: OneBoardComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OneBoardRoutingModule {}
