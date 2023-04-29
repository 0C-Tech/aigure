import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { MessageService } from '../../../components/message/message.service';
import { DestroyService } from '../../../core/destroy.service';
import { PageComponent } from '../../../core/page.component';
import { BotService } from '../../bot/bot.service';
import { BotInfo, LoginStep } from '../user.interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['../user.less', './setting.component.less'],
  providers: [DestroyService]
})
export class SettingComponent extends PageComponent implements OnInit {
  @Input() isPage = true;
  @Input() botId: string | number = '';
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  botInfo?: BotInfo;
  settingForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(40)]],
    greeting: ['', [Validators.required, Validators.maxLength(1000)]],
    description: ['', [Validators.maxLength(1000)]]
  });

  constructor(
    private destroy$: DestroyService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private userService: UserService,
    private botService: BotService
  ) {
    super();
  }

  ngOnInit() {
    setTimeout(() => {
      this.userService.updateStep(LoginStep.SETTING);
    }, 0);
    if (this.botId) {
      this.getBotInfo();
    }
  }

  saveBot() {
    const { value, valid } = this.validateForm(this.settingForm);
    if (valid) {
      const { name, greeting, description } = value;
      const payload: Record<string, any> = {
        displayName: name,
        greeting,
        description
      };
      if (this.botId) {
        payload['id'] = this.botId;
      }
      this.botService.saveBot(payload).pipe(takeUntil(this.destroy$)).subscribe((res) => {
        if (res.success) {
          if (this.isPage) {
            this.router.navigate(['/bot/chat']);
          } else {
            this.visibleChange.emit(false);
          }
        } else {
          this.message.error('保存失败');
        }
      });
    }
  }

  private getBotInfo() {
    this.botService.getBotInfo(this.botId).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if (res.success) {
        this.botInfo = res.data;
        this.settingForm.setValue({
          name: this.botInfo?.displayName || '',
          greeting: this.botInfo?.greeting || '',
          description: this.botInfo?.description || ''
        });
      } else {
        this.message.error('获取Bot信息失败');
      }
    });
  }
}
