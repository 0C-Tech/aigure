import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { EventStreamContentType, fetchEventSource } from '@microsoft/fetch-event-source';
import { marked } from 'marked';
import { takeUntil } from 'rxjs';
import { MessageService } from '../../../components/message/message.service';
import { ApiUrl } from '../../../config/api-url';
import { ApiService } from '../../../core/api.service';
import { DestroyService } from '../../../core/destroy.service';
import { textPosition } from '../../../helpers/util';
import { BotInfo, User } from '../../user/user.interface';
import { UserService } from '../../user/user.service';
import { ChatGPTResponse, ChatMessage, MessageBody } from '../bot.interface';
import { BotService } from '../bot.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.less'],
  providers: [DestroyService]
})
export class ChatComponent implements OnInit, AfterViewInit {
  @ViewChild('msgListEle') msgListEle!: ElementRef;
  @ViewChild('promptInput') promptInput!: ElementRef;
  prompt = '';
  messages: ChatMessage[] = [];

  userAvatar = '';
  user!: Partial<User>;
  settingVisible = false;
  botInfo?: BotInfo;
  botId?: string | number = '';

  private inputFlag = false;
  private messagePartial = '';

  constructor(
    private destroy$: DestroyService,
    private router: Router,
    private message: MessageService,
    private userService: UserService,
    private botService: BotService,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.user = this.userService.getCacheUser();
    this.userAvatar = this.userService.getUserAvatar(this.user.email || 'default');
    this.getBotList();
    this.getMessageList();
  }

  ngAfterViewInit() {
    this.promptInput.nativeElement.addEventListener(
      'compositionstart',
      () => {
        this.inputFlag = true;
      },
      false
    );
    this.promptInput.nativeElement.addEventListener(
      'compositionend',
      () => {
        this.inputFlag = false;
      },
      false
    );
  }

  sendMessage(withHistory = true) {
    const prompt = this.prompt.trim();
    if (!prompt) {
      this.message.warning('请输入内容。');
      this.prompt = '';
      return;
    }

    this.messages.push({
      id: Date.now(),
      isRobot: false,
      content: prompt
    });
    this.prompt = '';
    this.scrollBottom();

    const resHandler = (res: ChatGPTResponse) => {
      (res.choices || []).forEach((msg) => {
        this.messages.push({
          id: Date.now(),
          isRobot: true,
          content: msg.message.content.replace(/\r\n|\r|\n/gi, '<br/>')
        });
      });
      this.scrollBottom();
    };

    if (!withHistory) {
      this.botService.sendMessage(prompt).subscribe(resHandler);
    } else {
      const messages: ChatMessage[] = this.messages.slice(-10).map((item) => ({
        content: item.content,
        role: item.isRobot ? 'assistant' : 'user'
      }));
      this.botService
        .sendMessageWithHistory({
          messages,
          model: 'gpt-3.5-turbo'
        })
        .subscribe(resHandler);
    }
  }

  sendStreamMessage() {
    const prompt = this.prompt.trim();
    if (!prompt) {
      this.message.warning('请输入内容。');
      this.prompt = '';
      return;
    }

    this.messages.push({
      id: Date.now(),
      isRobot: false,
      content: prompt
    });
    this.prompt = '';
    this.scrollBottom();

    this.messages.push({
      isRobot: true,
      content: '',
      html: '<p></p>',
      loading: true
    });

    const messages: ChatMessage[] = this.messages.slice(-10).map((item) => ({
      content: item.content,
      role: item.isRobot ? 'assistant' : 'user'
    }));
    const ctrl = new AbortController();
    fetchEventSource(this.apiService.getApiUrl(ApiUrl.SEND_STREAM_MESSAGE), {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        token: this.apiService.getToken()
      },
      body: JSON.stringify({
        messages,
        model: 'gpt-3.5-turbo'
      }),
      signal: ctrl.signal,
      openWhenHidden: true,
      async onopen(response) {
        if (response.ok && response.headers.get('content-type') === EventStreamContentType) {
          return;
        }
        throw new Error(response.status + ': Error occurred while generating.');
      },
      onmessage: (msg) => {
        if (msg.data === '[DONE]') {
          ctrl.abort();
          this.updateMessage({ type: 'done' });
        } else if (msg.event !== 'ping') {
          try {
            if (msg.data) {
              const botMsg: ChatGPTResponse = JSON.parse(this.messagePartial + msg.data);
              this.messagePartial = '';
              if (botMsg.error) {
                this.updateMessage({ type: 'error', message: botMsg.error.message });
                return;
              }
              const { content } = botMsg.choices[0].message;
              this.updateMessage({ type: 'message', message: content || '' });
            }
          } catch (e) {
            this.messagePartial += msg.data;
          }
        }
      },
      onerror: (err) => {
        const errMsg = typeof err === 'string' ? err : err?.message || 'Error occurred while generating.';
        this.updateMessage({ type: 'error', message: errMsg });
        throw err;
      },
      onclose: () => {
        ctrl.abort();
        this.updateMessage({ type: 'done' });
      }
    });
  }

  onKeyDown(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    const isCtrlPressed = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
    const isShiftPressed = e.shiftKey;
    if (key === 'enter') {
      if (!isCtrlPressed) {
        e.preventDefault();
        if (!this.inputFlag) {
          this.sendStreamMessage();
        }
      } else {
        if (!isShiftPressed) {
          textPosition(<HTMLInputElement>e.target, '\n', false);
        }
      }
    }
  }

  openSetting() {
    this.settingVisible = true;
  }

  changeSettingVisible(visible: boolean) {
    !visible && this.getBotList();
  }

  voteMessage(message: ChatMessage, isLike: boolean) {
    if (!message.id) {
      return;
    }
    this.botService
      .voteMessage(message.id, isLike ? 'Like' : 'UnLike')
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.success) {
          message.voted = true;
        } else {
          this.message.error('操作失败');
        }
      });
  }

  protected scrollBottom() {
    const msgBoxEle = this.msgListEle.nativeElement;
    const { offsetHeight } = msgBoxEle;

    setTimeout(() => {
      msgBoxEle.scrollTop = msgBoxEle.scrollHeight - offsetHeight;
    }, 0);
  }

  private getMessageList() {
    this.botService
      .getMessageList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.messages = res.map((msg) => {
          msg.isRobot = msg.role === 'assistant';
          msg.voted = true;
          return msg;
        });
      });
  }

  private getBotList() {
    this.botService
      .getBotList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.success) {
          const botList: BotInfo[] = res.data || [];
          if (botList.length > 0) {
            this.botInfo = botList[0];
            this.botId = this.botInfo.id;
          } else {
            this.router.navigate(['/user/setting']);
          }
        } else {
          this.message.error('获取Bot信息失败');
        }
      });
  }

  private updateMessage(msg: MessageBody) {
    const lastIndex = this.messages.length - 1;
    switch (msg.type) {
      case 'done':
        this.messages[lastIndex].loading = false;
        this.scrollBottom();
        break;
      case 'message':
        this.messages[lastIndex].content += msg.message || '';
        this.messages[lastIndex].html = this.parseMarkdown(this.messages[lastIndex].content);
        this.scrollBottom();
        break;
      case 'error':
        this.message.error(msg.message || 'Error occurred while generating.');
        this.messages[lastIndex].loading = false;
        this.scrollBottom();
    }
  }

  private parseMarkdown = (msg: string): string => {
    return marked.parse(msg);
  };
}
