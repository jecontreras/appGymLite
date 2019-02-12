import { Component, OnInit } from '@angular/core';
import { FacturaService } from '../../services/factura.service';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import * as _ from 'lodash';
import { UserService } from '../../services/user.service';
import { FactoryModelService } from '../../services/factory-model.service';
import * as moment from 'moment';
import { ToolsService } from '../../services/tools.service';

@Component({
  selector: 'app-facturar',
  templateUrl: './facturar.component.html',
  styleUrls: ['./facturar.component.scss']
})
export class FacturarComponent implements OnInit {

  list: any = [];
  disabled: any = true;
  searchtext: any = '';
  data:any = {
    usuario: {},
    fecha: new Date(),
    valor: 2000,
    descripcion: 'todo Bien'
  };
  select:any = {};

  constructor(
    private _factura: FacturaService,
    private _user: UserService,
    private _tools: ToolsService,
    private _model: FactoryModelService
  ) {
      this.disabled = true;
  }

  ngOnInit() {
    this.get(false);
  }
  get(data: any){
    const
      query:any = {

      },
      _factura: any = this._factura,
      list:any = this.list
    ;
    if(data){
      if(this.searchtext){
        query.name= this.searchtext;
      }else{
        delete query.name;
      }
    }
    this._user.getUser(query)
    .subscribe(
      (res: any) =>{
        console.log(res);
        _.forEach(res.data, function(item){
          _factura.getfactura(item)
          .subscribe(
            (key: any) =>{
              // console.log(key);
              _.forEach(key.data, function(val){
                val.createdAt = moment(val.createdAt).format('DD/MM/YYYY');
                if(val.createdAt === moment().format('DD/MM/YYYY')){
                  item.check= true;
                }
              })
              ;
            }
          )
          ;
          list.push(item);
        })
        ;
        // this.list = res.data;
      }
    )
    ;
  }
  asistencia(obj: any){
    if(obj){
      this.data.usuario = obj;
      obj.check = true;
      this.disabled = false;
    }else{
      this.data = {
        usuario: {},
        fecha: new Date(),
        valor: 2000,
        descripcion: 'todo Bien'
      }
      ;
      this.disabled = true;
    }
  }
  guardarasis(){
    const
      obj: any = this.data
    ;

    if(obj){
      // console.log(obj);
      this._factura.pushfactura(obj)
      .subscribe(
        (res: any) =>{
          // console.log(res);
          if(res.id){
            this._tools.openSnack('Agregado Asistencia', '' , false);
            this.data = {};
            this.disabled = true;
          }
        }
      )
      ;
    }
  }

}
