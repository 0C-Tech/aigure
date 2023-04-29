import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './pages/user/user.interface';
import { UserService } from './pages/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  user!: User;
  isLoggedIn = false;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getUserInfo().subscribe((user) => {
      this.user = user;
      this.isLoggedIn = !!this.user.email;
    });
  }
}
