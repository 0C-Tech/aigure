import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalComponent } from '../../components/modal/modal.component';
import { CongratulationComponent } from './congratulation/congratulation.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ResetComponent } from './reset/reset.component';
import { SettingComponent } from './setting/setting.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { UserRoutingModule } from './user-routing.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { SettingModalComponent } from './setting-modal/setting-modal.component';

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    WelcomeComponent,
    CongratulationComponent,
    SettingComponent,
    UserLayoutComponent,
    ResetComponent,
    SettingModalComponent
  ],
  imports: [CommonModule, UserRoutingModule, FormsModule, ReactiveFormsModule, ModalComponent],
  exports: [SettingModalComponent]
})
export class UserModule {}
