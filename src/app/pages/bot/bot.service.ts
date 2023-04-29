import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiUrl } from '../../config/api-url';
import { ApiService } from '../../core/api.service';
import { HttpResponseEntity } from '../../core/http-response.interface';
import { BotInfo } from '../user/user.interface';
import { ChatGPTParam, ChatGPTResponse, ChatMessage } from './bot.interface';

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
      .pipe(map((res) => <any>(res?.data || {})));
  }

  saveBot(bot: Partial<BotInfo>): Observable<HttpResponseEntity> {
    return this.apiService
      .httpPost(this.apiService.getApiUrl(ApiUrl.SAVE_BOT), bot)
      .pipe(map((res) => <any>(res || {})));
  }

  getBotList(): Observable<HttpResponseEntity> {
    return this.apiService
      .httpPost(this.apiService.getApiUrl(ApiUrl.GET_BOT_LIST))
      .pipe(map((res) => <any>(res || {})));
  }

  getBotInfo(botId: string | number): Observable<HttpResponseEntity> {
    return this.apiService
      .httpPost(this.apiService.getApiUrl(ApiUrl.GET_BOT_INFO), {
        id: botId
      })
      .pipe(map((res) => <any>(res || {})));
  }

  getMessageList(): Observable<ChatMessage[]> {
    return this.apiService
      .httpGet(this.apiService.getApiUrl(ApiUrl.GET_MESSAGE_LIST))
      .pipe(map((res) => <any>(res?.data || [])));
  }

  voteMessage(msgId: number, vote: 'Like' | 'UnLike' | 'Normal'): Observable<HttpResponseEntity> {
    return this.apiService
      .httpPost(this.apiService.getApiUrl(ApiUrl.VOTE_MESSAGE), {
        messageId: msgId,
        likeOrNot: vote
      })
      .pipe(map((res) => <any>(res || {})));
  }
}
