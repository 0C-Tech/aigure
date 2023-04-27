import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs';
import { DestroyService } from '../../../core/destroy.service';
import { LoginStep } from '../user.interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.component.html',
  styleUrls: ['./user-layout.component.less'],
  providers: [DestroyService]
})
export class UserLayoutComponent implements OnInit {
  loginStep: LoginStep | void = LoginStep.WELCOME;

  constructor(private destroy$: DestroyService, private userService: UserService) {}

  ngOnInit() {
    this.userService.step$.pipe(takeUntil(this.destroy$)).subscribe((step) => {
      this.loginStep = step;
    });
  }
}
