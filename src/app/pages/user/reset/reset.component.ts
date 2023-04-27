import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from '../../../components/message/message.service';
import { DestroyService } from '../../../core/destroy.service';
import { PageComponent } from '../../../core/page.component';
import { LoginStep } from '../user.interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['../user.less', './reset.component.less'],
  providers: [DestroyService]
})
export class ResetComponent extends PageComponent implements OnInit {
  resetForm = this.fb.group({
    password: [null, [Validators.required, Validators.maxLength(20)]],
    repeatPassword: [null, [Validators.required, Validators.maxLength(20)]]
  }, {
    validators: [
      (control: AbstractControl): ValidationErrors | null => {
        const newPwd = control.get('password')?.value;
        const confirmPwd = control.get('repeatPassword')?.value;
        const result: ValidationErrors = { confirmPwd: {} };
        if (confirmPwd !== newPwd) {
          result['confirmPwd'].invalid = true;
          return result;
        }
        return null;
      }
    ]
  });

  constructor(
    private destroy$: DestroyService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private message: MessageService
  ) {
    super();
  }

  ngOnInit() {
    setTimeout(() => {
      this.userService.updateStep(LoginStep.RESET);
    }, 0);
  }

  resetPassword() {
    const { value, valid } = this.validateForm(this.resetForm);
    if (valid) {
      const { password } = value;
      let id: number;
      try {
        const user = this.userService.getCacheUser();
        id = user.id || 0;
      } catch (e) {
        id = 0;
      }
      if (!id) {
        this.message.error('用户不存在');
        return;
      }
      this.userService.saveUserInfo({
        id,
        password
      }).subscribe((res) => {
        if (res.success) {
          this.router.navigate(['../login'], { relativeTo: this.route });
        } else {
          this.message.error('保存失败');
        }
      });
    }
  }
}
