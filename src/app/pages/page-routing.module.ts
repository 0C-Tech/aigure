import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from '../guards/auth.guard';
import { UserLayoutComponent } from './user/user-layout/user-layout.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/user/welcome' },
  {
    path: 'user',
    component: UserLayoutComponent,
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule)
  },
  {
    path: 'bot',
    canMatch: [authGuard],
    loadChildren: () => import('./bot/bot.module').then((m) => m.BotModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PageRoutingModule {}
