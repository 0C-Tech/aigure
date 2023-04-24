import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiUrl } from '../../config/api-url';
import { ApiService } from '../../core/api.service';
import { ChatGPTParam, ChatGPTResponse } from './bot.interface';

@Injectable({
  providedIn: 'root'
})
export class BotService {
  constructor(private apiService: ApiService) {}

  sendMessage(message: string): Observable<ChatGPTResponse> {
    return this.apiService
      .httpPost(this.apiService.getApiUrl(ApiUrl.SEND_MESSAGE), {
        message
      })
      .pipe(map((res) => <any>(res || {})));
  }

  sendMessageWithHistory(param: ChatGPTParam): Observable<ChatGPTResponse> {
    return this.apiService
      .httpPost(this.apiService.getApiUrl(ApiUrl.SEND_MESSAGE_WITH_HISTORY), param)
      .pipe(map((res) => <any>(res || {})));
  }
}
