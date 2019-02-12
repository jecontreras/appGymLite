import { Injectable } from '@angular/core';
import { HttpClient,  HttpHeaders } from '@angular/common/http';
import { retryWhen, delayWhen, catchError, tap } from 'rxjs/operators';
import { timer } from 'rxjs';
import { FactoryModelService } from './factory-model.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private _model: FactoryModelService,
  ) {

 }
  getUser(query: any){
    return this._model.query('user', query);
  }
  getPlan(query: any){
    return this._model.query('plan', query);
  }
  getUsuarioPlan(query: any){
    return this._model.query('usuarioplan', query);
  }
  pushUser(query: any){
    return this._model.create('user', query);
  }
  putUser(query: any){
    return this._model.update('user', query.id, query);
  }
  pushPlan(query: any, data:any){
    console.log(query, data);
    if(data){
      const
        datos:any = {
          usuario: query.data.id,
          plan: query.data.usuarioplan
        }
      ;
      return this._model.create('usuarioplan', datos);
    }
  }
}
