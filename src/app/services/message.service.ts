import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Move } from '../two-board/player1/player1.component';

export let origin = environment.origin;

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor() {}

  public sendFromMain(message: Move): void {
    const toFrame = window.parent.document.getElementById(
      message.color === 'white' ? 'player2IFrame' : 'player1IFrame'
    ) as HTMLIFrameElement;
    toFrame.contentWindow?.postMessage({ from: 'main', ...message }, origin);
  }

  public resetGame(): void {
    let message = {
      from: 'main',
      reset: true,
      gameEnd: false,
      winner: undefined,
    };

    const toPlayer1 = window.parent.document.getElementById(
      'player1IFrame'
    ) as HTMLIFrameElement;
    toPlayer1.contentWindow?.postMessage(message, origin);

    const toPlayer2 = window.parent.document.getElementById(
      'player2IFrame'
    ) as HTMLIFrameElement;
    toPlayer2.contentWindow?.postMessage(message, origin);
  }
}
