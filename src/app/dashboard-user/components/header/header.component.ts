import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { FactoryModelService } from '../../services/factory-model.service';
import { ToolsService } from '../../services/tools.service';
import { GLOBAL } from './../../../services/global';
import * as _ from 'lodash';
import * as moment from 'moment';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnDestroy, OnInit {
   public mobileQuery: MediaQueryList;
   private _mobileQueryListener: () => void;
   public puntos: any;
   public puntosValor: number;
   public paquete: any;
   public vigencia: number;
   public fechaHoy: any;
   public user: any = {};
   public global: any = GLOBAL;
  constructor(
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher, private router: Router,
    private _model: FactoryModelService,
    private _tools: ToolsService
    ) {
    this.mobileQuery = media.matchMedia('(max-width: 290px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.puntosValor = 0;
    this._model.loadUser();
   }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  ngOnInit() {
    this.user = this._model.user;
  }
  logout() {
    localStorage.clear();
    // location.href = 'http://localhost:4200';
    // location.href = 'https://publi-click-front-luisalbertoj.c9users.io/login';
     location.href = 'https://publi-click-app.herokuapp.com/';
  }
}
