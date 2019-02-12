import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistryComponent } from './components/registry/registry.component';

const routes: Routes = [
 {path: '', redirectTo: 'login', pathMatch: 'full'},
 {path: 'login', component: LoginComponent },
 {path: 'registro', component: RegistryComponent },
 {path: 'registro/:username', component: RegistryComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
