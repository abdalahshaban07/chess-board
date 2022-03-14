import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-player2',
  templateUrl: './player2.component.html',
  styleUrls: ['./player2.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Player2Component implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  onClose(): void {
    const frame = window.parent.document.getElementById('player2IFrame');
    frame?.parentNode?.removeChild(frame);
  }
}
