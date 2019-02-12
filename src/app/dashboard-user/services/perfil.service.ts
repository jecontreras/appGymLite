import { Injectable } from '@angular/core';
import { GLOBAL } from './../../services/global';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { ToolsService } from './tools.service';
import { FactoryModelService } from './factory-model.service';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {
  private url: string;
  private handleError: any;
  public rta: any;
  constructor(
    private _http: HttpClient,
    private _model: FactoryModelService,
    private _tools: ToolsService
  ) {
    this.url = GLOBAL.url;
    this.rta = {
      url: GLOBAL.url,
      _model: this._model,
      _tools: this._tools,
      http: _http,
      data: {},
      btn: {
        edit: this.update
      }
    }
    ;
  }
  loadUser() {
    // console.log(this._model.user);
    this.rta.data = this._model.user;
    this._model.get('user', {id: this._model.user.id})
    .subscribe(
      (response: any) => {
        // console.log(response);
        response.referir = 'http://localhost:4200/registro/' + response.username;
        this.rta.data = response;
        if (this.rta.data.cabeza) {
          if (!this.rta.data.cabeza.username) {
            this.cargarCabeza();
          }
        }
      },
      (error: any) => {
        console.error('error', error);
      }
    )
    ;
    // console.log(this.rta.data);
  }
  cargarCabeza(): any {
    this._model.get('user', {id: this.rta.data.cabeza})
    .subscribe(
      (response: any) => {
        // console.log(response);
        this.rta.data.cabeza = response;
      },
      (error: any) => {
          console.log('Error', error);
      }
    );
  }
 update(cuerpo: any, obj: any) {
    // console.log(cuerpo, obj);
    if (cuerpo.data.id) {
      const
        query: any = {
          id: cuerpo.data.id
        }
      ;
      query[obj] = cuerpo.data[obj];
      // console.log(query);
      if (obj === 'username') {
        query.username = _.kebabCase(query.username);
        consult(cuerpo, query);
      }else{
        if(obj === 'password'){
          if(cuerpo.data.passwordAfter){
            query.password = cuerpo.data.password1;
            query.passwordverified = cuerpo.data.passwordverified;
            query.passwordAfter = cuerpo.data.passwordAfter;

            updd(cuerpo, query);
          }else{
            cuerpo._tools.openSnack('Error Ingrese Contraseña Anterior', false);
          }
        }else{
          updd(cuerpo, query);
        }
      }
      cuerpo.data[obj] = query[obj];
    }
    // tslint:disable-next-line:no-shadowed-variable
    function consult(cuerpo: any, query: any) {
      // console.log(query);
      return cuerpo._model.query('user', {
        username: query.username
      })
      .subscribe(
        data => {
          // console.log(data);
          data = data.data[0];
          if (!data) {
            updd(cuerpo, query);
          } else {
            cuerpo._tools.openSnack('Error el Username Ya Existe', false);
          }
        }
      );
    }
    // tslint:disable-next-line:no-shadowed-variable
    function updd(cuerpo: any, query: any) {
      return cuerpo._model.update('user', query.id, query)
      .subscribe(
        data => {
            console.log(data);
            cuerpo._tools.openSnack('Actualizado', false);
            actualizauser(cuerpo);
        },
        error => {
            console.log('Error', error);
        }
      );
    }
    // tslint:disable-next-line:no-shadowed-variable
    function actualizauser(cuerpo: any) {
      cuerpo._model.user = cuerpo.data;
      _.forEach(cuerpo.data, function(item, val) {
        if (cuerpo.data[val] !== cuerpo._model.user[val]) {
          cuerpo._model.user[val] = item;
        }
      })
      ;
    }
  }
  pushfile(cuerpo: any, obj: any) {
    // console.log(obj);
    // console.log(obj[0].name);
    const
      form = new FormData()
    ;
    // tslint:disable-next-line:quotemark
    if (obj) {
      form.append('file', obj[0]);
      return cuerpo._model.create('user/file', form);
    } else {
      cuerpo._tools.openSnack('Error', false);
    }
    // console.log(form);

  }
  deletefile(cuerpo: any, obj: any ) {
    if (obj) {
      return cuerpo._model.get('user/deletefile', {
        name: obj
      })
      ;
    }
  }
}
