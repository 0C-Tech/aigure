import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.less']
})
export class WelcomeComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}

  login() {
    this.router.navigate(['../login'], { relativeTo: this.route });
  }
}
