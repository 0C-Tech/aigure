import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ApiUrl } from '../../config/api-url';
import { ApiService } from '../../core/api.service';
import { HttpResponseEntity } from '../../core/http-response.interface';
import { BotInfo, LoginStep, User } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private step: BehaviorSubject<LoginStep | void> = new BehaviorSubject<LoginStep | void>(void 0);
  public step$: Observable<LoginStep | void> = this.step.asObservable();

  private loginUser: BehaviorSubject<User> = new BehaviorSubject<User>({ id: 0, email: '' });
  loginUser$: Observable<User> = this.loginUser.asObservable();

  constructor(private apiService: ApiService) {}

  updateStep(step: LoginStep) {
    this.step.next(step);
  }

  login(email: string, password: string): Observable<string> {
    return this.apiService
      .httpPost(this.apiService.getApiUrl(ApiUrl.LOGIN), {
        email,
        password
      })
      .pipe(
        map((res) => <any>(res?.data || '')),
        tap((res) => this.setAuth(res))
      );
  }

  setAuth(token: string) {
    if (token) {
      localStorage.setItem('token', token);
    }
  }

  register(user: Partial<User>): Observable<User> {
    return this.apiService
      .httpPost(this.apiService.getApiUrl(ApiUrl.REGISTER), user)
      .pipe(
        map((res) => <any>(res?.data || {})),
        tap((res) => {
          this.cacheUser(res);
          this.loginUser.next(res);
        })
      );
  }

  cacheUser(user: Partial<User>) {
    if (user.id) {
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        email: user.email
      }));
    }
  }

  getUserInfo(email: string): Observable<User> {
    return this.apiService
      .httpPost(this.apiService.getApiUrl(ApiUrl.GET_USER), {
        email
      })
      .pipe(
        map((res) => <any>(res?.data || {})),
        tap((res) => {
          this.cacheUser(res);
          this.loginUser.next(res);
        })
      );
  }

  saveUserInfo(user: Partial<User>): Observable<HttpResponseEntity> {
    return this.apiService
      .httpPost(this.apiService.getApiUrl(ApiUrl.SAVE_USER), user)
      .pipe(map((res) => <any>(res || {})));
  }

  saveBot(bot: Partial<BotInfo>) {
    return this.apiService
      .httpPost(this.apiService.getApiUrl(ApiUrl.SAVE_USER), bot)
      .pipe(map((res) => <any>(res?.data || {})));
  }
}
