import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DestroyService } from '../../../core/destroy.service';
import { LoginStep } from '../user.interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../user.less', './register.component.less'],
  providers: [DestroyService]
})
export class RegisterComponent implements OnInit {
  constructor(
    private destroy$: DestroyService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.updateStep(LoginStep.REGISTER);
  }

  register() {
    this.router.navigate(['../congratulation'], { relativeTo: this.route });
  }
}
