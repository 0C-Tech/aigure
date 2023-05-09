import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';
import { ApiUrl } from '../../config/api-url';
import { URL_AVATAR_API } from '../../config/common.constant';
import { ApiService } from '../../core/api.service';
import { HttpResponseEntity } from '../../core/http-response.interface';
import md5 from '../../helpers/md5';
import { format } from '../../helpers/util';
import { LoginStep, User } from './user.interface';

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
        tap((res) => {
          this.setAuth(res);
        })
      );
  }

  setAuth(token: string) {
    if (token) {
      localStorage.setItem('token', token);
    }
  }

  logout() {
  }

  register(user: Partial<User>): Observable<User> {
    return this.apiService
      .httpPost(this.apiService.getApiUrl(ApiUrl.REGISTER), user)
      .pipe(
        map((res) => <any>(res?.data || {})),
        tap((res) => {
          this.cacheUser(res);
          if (res.id) {
            this.loginUser.next(res);
          }
        })
      );
  }

  cacheUser(user: Partial<User>) {
    if (user.email) {
      localStorage.setItem('user', JSON.stringify({
        email: user.email
      }));
    }
  }

  getCacheUser(): Partial<User> {
    try {
      return JSON.parse(localStorage.getItem('user') || '{}');
    } catch (e) {
      return {};
    }
  }

  getUserInfo(): Observable<User> {
    return this.apiService
      .httpPost(this.apiService.getApiUrl(ApiUrl.GET_USER), {}, {
        handleError: false
      })
      .pipe(
        map((res) => <any>(res?.data || {})),
        tap((res) => {
          this.cacheUser(res);
          if (res.email) {
            this.loginUser.next(res);
          }
        })
      );
  }

  saveUserInfo(user: Partial<User>): Observable<HttpResponseEntity> {
    return this.apiService
      .httpPost(this.apiService.getApiUrl(ApiUrl.SAVE_USER), user)
      .pipe(map((res) => <any>(res || {})));
  }

  getUserAvatar(email: string): string {
    const hash = md5(email);
    return format(URL_AVATAR_API, hash, 'monsterid');
  }
}
