import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from '../../../core/destroy.service';
import { PageComponent } from '../../../core/page.component';
import { LoginStep } from '../user.interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../user.less', './register.component.less'],
  providers: [DestroyService]
})
export class RegisterComponent extends PageComponent implements OnInit {
  regForm = this.fb.group({
    email: ['', [Validators.required, Validators.maxLength(100), Validators.email]],
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
    private userService: UserService
  ) {
    super();
  }

  ngOnInit() {
    setTimeout(() => {
      this.userService.updateStep(LoginStep.REGISTER);
    }, 0);
  }

  register() {
    const { value, valid } = this.validateForm(this.regForm);
    if (valid) {
      const { email, password } = value;
      this.userService.register({
        email,
        password
      }).subscribe((res) => {
        if (res.email) {
          this.login(email, password);
        }
      });
    }
  }

  private login(email: string, password: string) {
    this.userService.login(email, password).subscribe(() => {
      this.router.navigate(['../congratulation'], { relativeTo: this.route });
    });
  }
}
