import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LoginStep } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private step: BehaviorSubject<LoginStep> = new BehaviorSubject<LoginStep>(LoginStep.WELCOME);
  public step$: Observable<LoginStep> = this.step.asObservable();

  updateStep(step: LoginStep) {
    this.step.next(step);
  }
}
