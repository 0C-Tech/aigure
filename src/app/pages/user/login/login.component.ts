import { Component, OnInit } from '@angular/core';
import { DestroyService } from '../../../core/destroy.service';
import { LoginStep } from '../user.interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../user.less', './login.component.less']
})
export class LoginComponent implements OnInit {
  constructor(private destroy$: DestroyService, private userService: UserService) {}

  ngOnInit() {
    this.userService.updateStep(LoginStep.LOGIN);
  }

  login() {

  }
}
