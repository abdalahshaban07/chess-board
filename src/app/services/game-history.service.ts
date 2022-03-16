import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GameHistoryService {
  constructor() {}

  setItem(key: string, data: [] = []): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getItem(key: string): [] {
    return JSON.parse(localStorage.getItem(key) || '[]');
  }
}
