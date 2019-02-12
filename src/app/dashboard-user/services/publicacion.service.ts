import { Injectable } from '@angular/core';
import { FactoryModelService } from './factory-model.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ToolsService } from './tools.service';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './../../services/global';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {
  private url: string;
  public rta: any;
  public data: any;
  public getput = this.getpublicacion;
  public  publicaciones: any;
  constructor(
    private _http: HttpClient,
    private _model: FactoryModelService,
    // public sanitizer: DomSanitizer,
    private _tools: ToolsService
  ) {
    this.url = GLOBAL.url;
    this.publicaciones = [];
    // this.chequiar();
  }
  chequiar() {
    const
      promises = []
    ;
    promises.push(
      this._model.get('publicacion', {
        // type: 'tarea-diaria'
      })
      .subscribe(
        data => {
            console.log(data);
        },
        error => {
            console.log('Error', error);
        }
      ));
  }
  getpublicacion(_model: any, _publicacion: any, ev: any) {
    // console.log(_model);
    const query: any = {
      where: {
        estado: 'activo',
        clicks: {'<': 20}
      },
      limit: 10,
      skip: 1
    };
    if (ev) {
      query.limit = ev.pageSize;
      query.skip = ev.pageIndex;
    }
    console.log(query);
    this._model.query('publicacion', query)
    .subscribe(
      (response: any) => {
          // _publicacion.publicaciones = response.data;
          _publicacion.publicaciones = _.unionBy(_publicacion.publicaciones || [], response.data, 'id');
          _publicacion._tools.openSnack('Publicaciones cargadas', 'Ok', false);
      },
      (error: any) => {
          console.log('Error', error);
      }
    );
  }
  // getpaginate(paginate: any) {
  //   // console.log(this._model.user, paginate);
  //   if (this._model.user) {
  //     return this._model.querys(this._model.user.id, paginate)
  //     .subscribe((res: any) => {
  //         // console.log(res);
  //         this.dataSource = _.unionBy(this.dataSource || [], res.data, 'id');
  //     })
  //     ;
  //   }
  // }


}
