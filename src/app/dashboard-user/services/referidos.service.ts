import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './../../services/global';
import { FactoryModelService } from './factory-model.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ToolsService } from './tools.service';

@Injectable({
  providedIn: 'root'
})
export class ReferidosService {
  private url: string;
  // private _model: any;
  public data: any;
  public get = this.getUser;
  public displayedColumns: string[] = [];
  public dataSource: string[] = [];
  public pageIndex = 1;
  public pageSize = 10;
  // public userquerys = this.userquerys;
  // public actividadquerys = this.actividadquerys;
  constructor(
    private _http: HttpClient,
    private _model: FactoryModelService,
    private _tools: ToolsService
  ) {
    // console.log(this._model.user);
    this.url = GLOBAL.url;
    this._model = this._model;
    this.getUser('');
  }
  getUser(paginate: any) {
    // console.log(this._model.user, paginate);
    if (this._model.user) {
      this.displayedColumns = ['posicion', 'foto', 'nombre', 'email', 'celular', 'nivel'];
      return this.userquerys(this._model.user.id, paginate)
      .subscribe((res: any) => {
          console.log(res);
          this.dataSource = _.unionBy(this.dataSource || [], res.data, 'id');
      })
      ;
    }
  }
  userquerys(data, paginate) {
    console.log('data_:' + data);
    // console.log(paginate);
    if (paginate) {
      if (paginate.pageSize) {
        this.pageIndex = paginate.pageIndex;
        this.pageSize = paginate.pageSize;
      }
    }
    // const
    //   querys: any = {
    //       'cabeza': data
    //   }
    // ;
    const
      querys: any = {
          where:{
            'cabeza': data
          },
          limit: this.pageSize || 5,
          skip: this.pageIndex | 1
      }
    ;
    // // console.log(pageIndex, pageSize);
    return this._model.query('user', querys)
    ;
  }
  // TODO no buscar por los 2 atributos solo busca por 1
  actividadquerys(data) {
    console.log(data.username);
    return this._model.query('actividad', {
        where: {
          user: data.id,
          // username: data.username
          estado: 'realizado'
        },
        limit: -1
    })
    ;
  }
}
