import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from '../../../core/destroy.service';
import { LoginStep } from '../user.interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['../user.less', './setting.component.less']
})
export class SettingComponent implements OnInit {
  constructor(
    private destroy$: DestroyService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.updateStep(LoginStep.SETTING);
  }

  createAccount() {
    this.router.navigate(['/bot/chat']);
  }
}
