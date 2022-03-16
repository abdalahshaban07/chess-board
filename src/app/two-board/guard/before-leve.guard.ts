import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { GameHistoryService } from 'src/app/services/game-history.service';
import { HomeComponent } from '../home/home.component';

@Injectable({
  providedIn: 'root',
})
export class BeforeLeveGuard implements CanDeactivate<HomeComponent> {
  constructor(private gameHistoryServ: GameHistoryService) {}
  canDeactivate(
    component: HomeComponent
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (component?.moveFromPlayer?.moveHistory?.length) {
      let confirmAns = confirm(
        'Do you want to leave? If Ok I will save your game state to back again to contiune later'
      );
      if (!confirmAns) {
        return false;
      }
      this.gameHistoryServ.setItem(
        'gameHistory',
        component?.moveFromPlayer.moveHistory
      );
      return true;
    }
    return true;
  }
}
