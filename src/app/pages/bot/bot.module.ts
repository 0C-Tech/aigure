import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../../pipes/pipes.module';
import { UserModule } from '../user/user.module';
import { BotRoutingModule } from './bot-routing.module';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [ChatComponent],
  imports: [CommonModule, BotRoutingModule, FormsModule, PipesModule, UserModule]
})
export class BotModule {}
