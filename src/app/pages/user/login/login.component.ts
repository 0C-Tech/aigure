import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from '../../../components/message/message.service';
import { DestroyService } from '../../../core/destroy.service';
import { PageComponent } from '../../../core/page.component';
import { LoginStep } from '../user.interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../user.less', './login.component.less']
})
export class LoginComponent extends PageComponent implements OnInit {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.maxLength(100), Validators.email]],
    password: [null, [Validators.required, Validators.maxLength(20)]]
  });

  constructor(
    private destroy$: DestroyService,
    private fb: FormBuilder,
    private router: Router,
    private message: MessageService,
    private userService: UserService
  ) {
    super();
  }

  ngOnInit() {
    setTimeout(() => {
      this.userService.updateStep(LoginStep.LOGIN);
    }, 0);
  }

  login() {
    const { value, valid } = this.validateForm(this.loginForm);
    if (valid) {
      const { email, password } = value;
      this.userService.login(email, password).subscribe((res) => {
        if (res) {
          this.getUserInfo(email);
        } else {
          this.message.error('登录失败');
        }
      });
    }
  }

  private getUserInfo(email: string) {
    this.userService.getUserInfo(email).subscribe(() => {
      this.router.navigate(['/bot/chat']);
    });
  }
}
