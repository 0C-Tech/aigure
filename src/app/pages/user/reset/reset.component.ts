import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from '../../../core/destroy.service';
import { LoginStep } from '../user.interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['../user.less', './reset.component.less']
})
export class ResetComponent implements OnInit {
  constructor(
    private destroy$: DestroyService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.updateStep(LoginStep.RESET);
  }

  resetPassword() {

  }
}
