import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from '../../../core/destroy.service';
import { LoginStep } from '../user.interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['../user.less', './welcome.component.less'],
  providers: [DestroyService]
})
export class WelcomeComponent implements OnInit {
  constructor(
    private destroy$: DestroyService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.userService.updateStep(LoginStep.WELCOME);
    }, 0);
  }

  login() {
    this.router.navigate(['../login'], { relativeTo: this.route });
  }
}
