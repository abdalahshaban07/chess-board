import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameHistoryService {
  constructor() {}

  setItem(data: [] = []): void {
    localStorage.setItem('gameHistory', JSON.stringify(data));
  }
  getItem(key: string = 'gameHistory'): [] {
    return JSON.parse(localStorage.getItem('gameHistory') || '[]');
  }
}
