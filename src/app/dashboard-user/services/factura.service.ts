import { Injectable } from '@angular/core';
import { FactoryModelService } from './factory-model.service';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {
  constructor(
    private _model: FactoryModelService
  ) {
  }
  getfactura(query: any){
    // console.log(new Date());
    return this._model.query('asistencia', {
      usuario: query.id,
      // createdAt: {
      //   '>=': new Date(),
      //   '<=': new Date()
      // }
    });
  }
  getusuario(query: any){
    return this._model.query('user', query);
  }
  pushfactura(query: any){
    return this._model.create('asistencia', query);
  }
}
