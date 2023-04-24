import { HttpClient, HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';
import { ApiUrl } from '../config/api-url';
import { Message } from '../config/message.enum';
import { HttpResponseEntity } from './http-response.interface';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrlPrefix: string = ApiUrl.API_URL_PREFIX;

  constructor(private http: HttpClient, private router: Router, private message: NzMessageService) {}

  getApiUrl(path: string): string {
    return `${this.apiUrlPrefix}${path}`;
  }

  httpGet<T extends HttpResponseEntity>(
    url: string,
    param: Record<string, any> = {},
    disableMessage = false
  ): Observable<T> {
    return this.http
      .get<T>(url, {
        params: new HttpParams({
          fromObject: param
        }),
        observe: 'body'
      })
      .pipe(catchError(this.handleError<T>(disableMessage)));
  }

  httpGetData<T extends HttpResponseEntity>(
    url: string,
    param: Record<string, any> = {},
    disableMessage = false
  ): Observable<any> {
    return this.http
      .get<T>(url, {
        params: new HttpParams({
          fromObject: param
        }),
        observe: 'body'
      })
      .pipe(
        map((res) => res?.data),
        catchError(this.handleError<T>(disableMessage))
      );
  }

  httpPost<T extends HttpResponseEntity>(
    url: string,
    body: Record<string, any> | FormData = {},
    disableMessage = false
  ): Observable<T> {
    return this.http
      .post<T>(url, body, {
        observe: 'body'
      })
      .pipe(catchError(this.handleError<T>(disableMessage)));
  }

  private handleError<T>(disableMessage: boolean) {
    return (error: HttpErrorResponse): Observable<T> => {
      if (error.status !== HttpStatusCode.NotFound) {
        if (!disableMessage) {
          this.message.error(error.error?.message || error.message || Message.UNKNOWN_ERROR);
        }
        // Let the app keep running by returning an empty result.
        return of(error.error as T);
      }
      this.router.navigate(['404']);
      return EMPTY;
    };
  }
}
