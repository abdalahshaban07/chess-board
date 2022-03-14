import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  iFrame1Url!: SafeResourceUrl;
  iFrame2Url!: SafeResourceUrl;
  displayIFrame: boolean = false;

  ngOnInit(): void {
    this.onStartGame();
  }

  constructor(private sanitizer: DomSanitizer) {}

  onStartGame(): void {
    this.displayIFrame = true;
    this.iFrame1Url = this.sanitizer.bypassSecurityTrustResourceUrl('/player1');
    this.iFrame2Url = this.sanitizer.bypassSecurityTrustResourceUrl('/player2');
  }
}
