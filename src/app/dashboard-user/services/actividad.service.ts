import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { GLOBAL } from './../../services/global';
import { interval } from 'rxjs';
import {DomSanitizer, SafeResourceUrl} from '@angular/platform-browser';
import { FactoryModelService } from './factory-model.service';
import * as _ from 'lodash';
import * as moment from 'moment';
import { ToolsService } from './tools.service';
@Injectable({
  providedIn: 'root'
})
export class ActividadService {
  private url: string;
  public rta: any;
  public timerInterval: any;
  public data: any;
  urf: SafeResourceUrl;
  constructor(
    private _http: HttpClient,
    private _model: FactoryModelService,
    public sanitizer: DomSanitizer,
    private _tools: ToolsService
  ) {
    this.url = GLOBAL.url;
    this.rta = {
      _model: _model,
      _tools: _tools,
      putactividadgratis: [],
      putactividadpagas: [],
      putactividadsuper: [],
      sanitizer: sanitizer,
      disabled: true,
      disabledpagas: true,
      disabledsuper: true,
      data: {},
      cumplidadGratis: 0,
      restanteGratis: 0,
      cumplidadPagas: 0,
      restantePagas: 0,
      cumplidadSuper: 0,
      restanteSuper: 0,
      actividades: [],
      actividadespagas: [],
      actividadessuper: [],
      contdisable: false,
      src: '',
      disable: {
        puble: false,
        contador: true
      },
      btn: {
        open: this.open,
        buttondisable: this.buttondisable,
        close: this.close,
        initConter: this.initConter,
        stopConter: this.stopConter,
        chequear: this.chequear,
        codigo: this.codigo
      },
      contador_s: 0,
      codigo: 0,
      textCodigo: '',
      url: GLOBAL.url,
      http: _http
    }
    ;
    this.List(this.rta);

  }
  List(obj: any) {
    return this._model.get('publicacion', {
      prioridad: 'tarea-diaria'
    })
    .subscribe(
      data => {
          // console.log(data);
          obj.actividades = data;
          this.listactividadespagas(obj);
      },
      error => {
          console.log('Error', error);
      }
    );
  }
  listactividadespagas(obj) {
    return this._model.get('publicacion', {
      preriodad: 'tarea-referidos'
    })
    .subscribe(
      data => {
          // console.log(data);
          obj.actividadespagas = data;
      },
      error => {
          console.log('Error', error);
      }
    );
  }
  open(cuerpo: any, obj: any) {
    cuerpo.disable.puble = true;
    // console.log(cuerpo);
    this.initConter(cuerpo);
   /*  console.log(cuerpo.sanitizer); */
    this.urf = cuerpo.sanitizer.bypassSecurityTrustResourceUrl(obj.content);
    obj.content = this.urf;
    // console.log(obj);
    cuerpo.data = obj;
  }
  close(cuerpo: any) {
    // console.log(cuerpo);
    cuerpo.disable.puble = false;
  }
  initConter(cuerpo: any) {
    // tslint:disable-next-line:no-shadowed-variable
    const interval = setInterval(() => {
      if (cuerpo.contador_s === 5) {
        cuerpo.contador_s = -1;
        cuerpo.contdisable = true;
        this.stopConter(cuerpo, interval);
      }
      // console.log(cuerpo.contador_s);
      cuerpo.contador_s++;
    }, 1000);
  }
  // tslint:disable-next-line:no-shadowed-variable
  stopConter(cuerpo: any, interval: any) {
    // console.log(this.timerInterval);
    clearInterval(interval);
    cuerpo.disable.contador = false;
    cuerpo.codigo = cuerpo.btn.codigo();
    // cuerpo.contador_s = 0;
  }
  codigo() {
    return (Date.now().toString(36).substr(2, 3) + Math.random().toString(36).substr(2, 2)).toUpperCase();
  }

  chequear(cuerpo: any) {
    // console.log("chequear", _.upperFirst(cuerpo.textCodigo));
    // console.log(cuerpo.data);
    if (cuerpo.textCodigo === cuerpo.codigo) {
    cuerpo.contdisable = true;
      if (cuerpo.data.prioridad === 'tarea-diaria') {
        if (cuerpo.cumplidadGratis !== 5) {
          cuerpo.cumplidadGratis += +1;
        }
        if (cuerpo.restanteGratis) {
          cuerpo.restanteGratis = cuerpo.restanteGratis - 1;
        }
      } else if (cuerpo.data.prioridad === 'tarea-referidos') {
        if (cuerpo.cumplidadGratis !== 5) {
          cuerpo.cumplidadGratis += +1;
        }
        if (cuerpo.restanteGratis) {
          cuerpo.restanteGratis = cuerpo.restanteGratis - 1;
        }
      } else {
        if (cuerpo.cumplidadSuper !== 5) {
          cuerpo.cumplidadSuper += +1;
          const
            query = {
              id: cuerpo.putactividadsuper[0].id,
              publicacion: cuerpo.data.id
            }
          ;
        }
        if (cuerpo.restanteSuper) {
          cuerpo.restanteSuper = cuerpo.restanteSuper - 1;
        }
      }
      cuerpo.data.check = true;
      this.close(cuerpo);
      return true;
    } else {
      cuerpo.textCodigo = '';
      cuerpo.codigo = cuerpo.btn.codigo();
      return false;
    }
  }
  buttondisable(data: any) {
    // console.log(data);
    if (data.putactividadgratis.length === 0) {
      // this._tools.openSnack('Entre', 'ok', false);
      data.disabled = false;
    }
    if (data.putactividadpagas.length === 0) {
      // this._tools.openSnack('Entre', 'ok', false);
      data.disabledpagas = false;
    }
    if (data.putactividadsuper.length === 0) {
      // this._tools.openSnack('Entre', 'ok', false);
      data.disabledsuper = false;
    }
    // console.log(data);
  }
}
