import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OneBoardModule } from './one-board/one-board.module';
import { TwoBoardModule } from './two-board/two-board.module';
import { StartComponent } from './start/start.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [AppComponent, StartComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TwoBoardModule,
    OneBoardModule,
    // NgbModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
