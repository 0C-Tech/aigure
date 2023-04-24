import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { UserRoutingModule } from './user-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { CongratulationComponent } from './congratulation/congratulation.component';
import { SettingComponent } from './setting/setting.component';

@NgModule({
  declarations: [RegisterComponent, LoginComponent, WelcomeComponent, CongratulationComponent, SettingComponent],
  imports: [CommonModule, UserRoutingModule]
})
export class UserModule {}
