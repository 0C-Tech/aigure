import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { MessageService } from '../../../components/message/message.service';
import { DestroyService } from '../../../core/destroy.service';
import { textPosition } from '../../../helpers/util';
import { BotInfo, User } from '../../user/user.interface';
import { UserService } from '../../user/user.service';
import { ChatGPTResponse, ChatMessage } from '../bot.interface';
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

  private inputFlag = false;

  constructor(
    private destroy$: DestroyService,
    private router: Router,
    private message: MessageService,
    private userService: UserService,
    private botService: BotService
  ) {
  }

  ngOnInit() {
    this.user = this.userService.getCacheUser();
    this.userAvatar = this.userService.getUserAvatar(this.user.email || 'default');
    this.getBotList();
    this.getMessageList();
  }

  ngAfterViewInit() {
    this.promptInput.nativeElement.addEventListener('compositionstart', () => {
      this.inputFlag = true;
    }, false);
    this.promptInput.nativeElement.addEventListener('compositionend', () => {
      this.inputFlag = false;
    }, false);
  }

  sendMessage(withHistory = true) {
    const prompt = this.prompt.trim();
    if (!prompt) {
      this.message.warning('请输入内容。');
      this.prompt = '';
      return;
    }

    this.messages.push({
      isRobot: false,
      content: prompt
    });
    this.prompt = '';
    this.scrollBottom();

    const resHandler = (res: ChatGPTResponse) => {
      (res.choices || []).forEach((msg) => {
        this.messages.push({
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
      this.botService.sendMessageWithHistory({
        messages,
        model: 'gpt-3.5-turbo'
      }).subscribe(resHandler);
    }
  }

  onKeyDown(e: KeyboardEvent) {
    const key = e.key.toLowerCase();
    const isCtrlPressed = e.altKey || e.ctrlKey || e.metaKey || e.shiftKey;
    const isShiftPressed = e.shiftKey;
    if (key === 'enter') {
      if (!isCtrlPressed) {
        e.preventDefault();
        if (!this.inputFlag) {
          this.sendMessage();
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

  protected scrollBottom() {
    const msgBoxEle = this.msgListEle.nativeElement;
    const { offsetHeight } = msgBoxEle;

    setTimeout(() => {
      msgBoxEle.scrollTop = msgBoxEle.scrollHeight - offsetHeight;
    }, 0);
  }

  private getMessageList() {
    this.botService.getMessageList().pipe(takeUntil(this.destroy$)).subscribe((res) => {

    });
  }

  private getBotList() {
    this.botService.getBotList().pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res.success) {
        const botList: BotInfo[] = res.data || [];
        if (botList.length > 0) {
          this.botInfo = botList[0];
        }
      } else {
        this.message.error('获取Bot信息失败');
      }
    })
  }
}
