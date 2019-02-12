import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from './main.component';
import { HomeComponent } from './views/home/home.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { FacturarComponent } from './components/facturar/facturar.component';
import { UsuarioComponent } from './components/usuario/usuario.component';

import { AuthService } from './../services/auth.service';

import { CompraFinalizadaComponent } from './views/compra-finalizada/compra-finalizada.component';

const dashboardRoutes: Routes = [
 {
   path: 'dashboard',
   component: MainComponent,
   canActivate: [AuthService],
   children: [
     {path: '', redirectTo: 'home', pathMatch: 'full'},
     {path: 'home', component: HomeComponent},
     {path: 'perfil', component: PerfilComponent },
     {path: 'usuario', component: UsuarioComponent},
     {path: 'asistencia', component: FacturarComponent}, //es una factura
     {path: 'compra-finalizada/:state/:paquete/:payu', component: CompraFinalizadaComponent},
     {path: '**', redirectTo: 'home', pathMatch: 'full'}
   ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(dashboardRoutes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
