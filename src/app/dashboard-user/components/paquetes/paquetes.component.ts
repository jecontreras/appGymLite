import { Component, OnInit } from '@angular/core';
import { PaquetesService } from '../../services/paquetes.service';
import { ToolsService } from '../../services/tools.service';
import * as _ from 'lodash';
import * as md5 from 'md5';
import { FactoryModelService } from '../../services/factory-model.service';
import { GLOBAL } from '../../../services/global';
@Component({
  selector: 'app-paquetes',
  templateUrl: './paquetes.component.html',
  styleUrls: ['./paquetes.component.scss']
})
export class PaquetesComponent implements OnInit {
  public paquetes: any;
  private globalUrl: string = GLOBAL.url;
  constructor(
    private _paquetesService: PaquetesService,
    private _tools: ToolsService,
    private _model: FactoryModelService,
  ) {
    this.cargarPaquetes();
  }

  ngOnInit() {
  }
  cargarPaquetes() {
    this._model.get('paquete', false)
    .subscribe(
      (response: any) => {
          console.log(response);
          if (response.length > 0) {
            this.paquetes = response;
            this.datospayu();
          } else {
            this._tools.openSnack('No se encontraron paquetes que cargar', 'Error' , false);
          }
      },
      (error: any) => {
          this._tools.openSnack('Ha ocurrido un error al cargar los paquetes', 'Error' , false);
          console.log('Error', error);
      }
    );
  }
  datospayu() {
    _.forEach(this.paquetes, function(item, key, paquetes) {
      const datosPayu: any = {
        ApiKey: '4Vj8eK4rloUd272L48hsrarnUA',
        merchantId: 508029,
        accountId: 512321,
        description: 's',
        referenceCode: 's',
        amount: 100,
        tax: 0,
        taxReturnBase: 16806,
        currency: 'COP',
        signature: '7ee7cf808ce6a39b17481c54f2c57acc',
        test: 1,
        buyerEmail: JSON.parse(localStorage.getItem('user')).email,
        nickname_buyer: JSON.parse(localStorage.getItem('user')).username,
        /* confirmationUrl: 'https://publi-click-back-luisalbertoj.c9users.io/paquete/comprado' */
        // confirmationUrl: 'http://localhost:1337/paquete/comprado'
        confirmationUrl: 'https://publi-click.herokuapp.com/paquete/comprado'
      };
      datosPayu.description = item.id + '|' + item.title + ' = ' + item.valor;
      datosPayu.referenceCode = (Number(Math.ceil(Math.random() * 100000) + Math.ceil(Math.random() * 100000)));
      datosPayu.amount = item.valor;
      datosPayu.tax = (item.valor * 0.19).toFixed(2);
      datosPayu.taxReturnBase = item.valor - datosPayu.tax;
      /* datosPayu.responseUrl = 'https://publi-click-front-luisalbertoj.c9users.io/dashboard/actividades'; */
      datosPayu.responseUrl = 'https://publi-click-app.herokuapp.com/';
      /* datosPayu.responseUrl = 'http://localhost:4200/dashboard/compra-finalizada/' +
          'payu=true/paquete=' + item.title; */
      datosPayu.signature = md5(datosPayu.ApiKey + '~' + datosPayu.merchantId + '~' +
      datosPayu.referenceCode + '~' + datosPayu.amount + '~' + datosPayu.currency);
      paquetes[key].datosPayu = datosPayu;
    });
  }
}
