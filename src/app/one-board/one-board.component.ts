import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-one-board',
  templateUrl: './one-board.component.html',
  styleUrls: ['./one-board.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OneBoardComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
