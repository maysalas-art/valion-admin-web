import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ProfileComponent } from './admin/profile/profile.component';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
    { 
      path: 'profile', 
      component: ProfileComponent, 
      canActivate: [authGuard] // guard
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
  ];