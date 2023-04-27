import { Component, OnInit } from '@angular/core';
import { DestroyService } from '../../../core/destroy.service';
import { LoginStep } from '../user.interface';
import { UserService } from '../user.service';

@Component({
  selector: 'app-congratulation',
  templateUrl: './congratulation.component.html',
  styleUrls: ['../user.less', './congratulation.component.less'],
  providers: [DestroyService]
})
export class CongratulationComponent implements OnInit {
  constructor(private destroy$: DestroyService, private userService: UserService) {}

  ngOnInit() {
    this.userService.updateStep(LoginStep.CONGRATULATION);
  }
}
