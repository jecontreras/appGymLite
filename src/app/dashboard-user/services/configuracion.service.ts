import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './../../services/global';
import { interval } from 'rxjs';
import { retryWhen, delayWhen, catchError, tap } from 'rxjs/operators';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { FactoryModelService } from './factory-model.service';
import * as _ from 'lodash';
import { ToolsService } from './tools.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionService {
  private url: string;
  private handleError: any;
  public rta: any = {};
  public lista: any = this.List;
  constructor(
    private _http: HttpClient,
    private _model: FactoryModelService,
    private _tools: ToolsService
  ) {
    this.url = GLOBAL.url;
    this.rta = {
      _tools: _tools,
      data: {},
      cantidaddisponible: 0,
      actividades: [],
      http: _http,
      url: GLOBAL.url,
      list: this.List,
      select: this.select,
      disable: {
        action: false
      },
      btn: {
        editar: this.editar,
        elimiar: this.eliminar,
        crear: this.crear,
        agregar: this.agregar,
        puslist: this.puslist
      }
    }
    ;
  }
  List() {
    if(this._model.user){
      return  this._model.get('publicacion', {
        // prioridad: 'tarea-diaria'
        user: this._model.user.id
      });
    }
  }
  crear(cuerpo: any, obj: any) {
    cuerpo.rta.disable.action = !cuerpo.rta.disable.action;
    if (obj) {
      cuerpo.rta.data = obj;
    } else {
      cuerpo.rta.data = {};
    }
  }
  puslist(cuerpo: any, data: any) {
    /* console.log(cuerpo, data); */
    cuerpo.items.push(data);
  }
  agregar(cuerpo: any) {
    /* console.log(cuerpo, cuerpo.rta.data); */
    // console.log(cuerpo);
    if(cuerpo._model.user){
      cuerpo.rta.data.user = cuerpo._model.user.id;
      // console.log(parseInt(cuerpo.rta.data.prerioda));
      // tslint:disable-next-line:radix
      cuerpo.rta.data.prerioda = parseInt(cuerpo.rta.data.prerioda);
      // console.log(cuerpo.rta.data);
      if (cuerpo.rta.data.title) {
        return cuerpo._model.create('publicacion', cuerpo.rta.data)
          .subscribe(
            data => {
                // console.log('POST Request is successful ', data);
                cuerpo.rta.data = {};
                cuerpo.rta.btn.puslist(cuerpo, data);
                cuerpo.rta._tools.openSnack('Agregado', false);
            },
            error => {
                console.log('Error', error);
            }
        );
      }
    }
  }
  editar(cuerpo: any, obj: any) {
    // console.log(cuerpo);
    const
      data = cuerpo.rta.data
    ;
    let query: any = {};
    const
      promises = []
    ;
    if (data) {
      if (data.id) {
        query = {
          id: data.id
        }
        ;
        query[obj] = data[obj];
        // console.log(query);
        promises.push(cuerpo.rta.http.put(cuerpo.rta.url + 'publicacion/' + query.id, query)
        .subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          (data: any) => {
              // console.log('PUT Request is successful ', data);
              cuerpo.rta._tools.openSnack('Actualizado', false);
              return data;
          },
          (error: any) => {
              console.log('Error', error);
          }
      ));
      }
    }
  }
  pushfile(cuerpo: any, obj: any){
    // console.log(obj);
    const
      form = new FormData()
    ;
    form.append("file", obj[0]);
    // console.log(form);

    return cuerpo._model.create('publicacion/file', form)
    ;
  }
  deletefile(cuerpo: any, obj:any ){
    if(obj){
      return cuerpo._model.get('publicacion/deletefile',{
        name: obj
      })
      ;
    }
  }
  eliminar(ev: any, cuerpo: any, data: any) {
    // console.log(cuerpo);
    if (data) {
      if (data.id) {
        const
          promises = []
        ;
        promises.push(cuerpo.rta.http.delete(cuerpo.rta.url + 'publicacion/' + data.id, data)
        .subscribe(
          // tslint:disable-next-line:no-shadowed-variable
          (data: any) => {
              // console.log("PUT Request is successful ", data);
              cuerpo.rta._tools.openSnack('Eliminado', false);
              if (data.id) {
                const
                  idx = _.findIndex(cuerpo.items, ['id', data.id])
                ;
                // console.log(idx);
                if (idx > -1) {
                  // console.log(cuerpo.items[idx]);
                  if (cuerpo.items[idx]) {
                    cuerpo.items.splice(idx, 1);
                  }
                }
              }
              return data;
          },
          (error: any) => {
              console.log('Error', error);
          }
      ));
      }
    }
  }
  select(obj: any) {
    // console.log(obj);
    obj.check = !obj.check;
  }

}
