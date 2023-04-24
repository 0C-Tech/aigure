import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CongratulationComponent } from './congratulation/congratulation.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SettingComponent } from './setting/setting.component';
import { UserRoutingModule } from './user-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [RegisterComponent, LoginComponent, WelcomeComponent, CongratulationComponent, SettingComponent],
  imports: [CommonModule, UserRoutingModule]
})
export class UserModule {}
