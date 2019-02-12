import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MyOwnCustomMaterialModule } from '../app.material.module';
import { MainComponent } from './main.component';
import { MainRoutingModule } from './main-routing.module';
import { HomeComponent } from './views/home/home.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PerfilComponent } from './components/perfil/perfil.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { CompraFinalizadaComponent } from './views/compra-finalizada/compra-finalizada.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { FacturarComponent } from './components/facturar/facturar.component';
import { AsistenciaComponent } from './dialog/asistencia/asistencia.component';
// Componentes

@NgModule({
  declarations: [
    MainComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    PerfilComponent,
    CompraFinalizadaComponent,
    NavbarComponent,
    SidebarComponent,
    UsuarioComponent,
    FacturarComponent,
    AsistenciaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule,
    FlexLayoutModule,
    MyOwnCustomMaterialModule,
    MainRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
  ],
  bootstrap: [MainComponent]
})
export class DashboardModule { }
