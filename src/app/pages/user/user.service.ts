import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginStep } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private step: BehaviorSubject<LoginStep | void> = new BehaviorSubject<LoginStep | void>(void 0);
  public step$: Observable<LoginStep | void> = this.step.asObservable();

  updateStep(step: LoginStep) {
    this.step.next(step);
  }
}
