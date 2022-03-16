import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StartComponent implements OnInit {
  ngOnInit(): void {}

  showBtn: boolean = true;
  constructor(private router: Router) {}

  goTo(router: string) {
    this.showBtn = false;
    this.router.navigate([router]);
  }
}
