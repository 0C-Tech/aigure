import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../../components/message/message.service';
import { DestroyService } from '../../../core/destroy.service';
import { PageComponent } from '../../../core/page.component';
import { LoginStep } from '../user.interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['../user.less', './setting.component.less'],
  providers: [DestroyService]
})
export class SettingComponent extends PageComponent implements OnInit {
  settingForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(40)]],
    greeting: [null, [Validators.required, Validators.maxLength(1000)]],
    description: [null, [Validators.maxLength(1000)]]
  });

  constructor(
    private destroy$: DestroyService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private message: MessageService,
    private userService: UserService
  ) {
    super();
  }

  ngOnInit() {
    this.userService.updateStep(LoginStep.SETTING);
  }

  saveBot() {
    const { value, valid } = this.validateForm(this.settingForm);
    if (valid) {
      const { name, greeting, description } = value;
      this.userService.saveBot({
        displayName: name,
        greeting,
        description
      }).subscribe((res) => {
        if (res.success) {
          this.router.navigate(['/bot/chat']);
        } else {
          this.message.error('保存失败');
        }
      });
    }
  }
}
