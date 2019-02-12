import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import * as _ from 'lodash';
import * as moment from 'moment';
import { TableroService } from './../../services/tablero.service';
import { FactoryModelService } from '../../services/factory-model.service';


@Component({
  selector: 'app-tablero',
  templateUrl: './tablero.component.html',
  styleUrls: ['./tablero.component.scss'],
  providers: [TableroService,FactoryModelService]
})
export class TableroComponent implements OnInit {

  canvas:any = {};
  dataPuntos: any = {};
  dataPuntosRef: any = {};
  dataCantidadRef: any = {};
  dataPaquetes: any = {};
  dataRetiradoPuntos: any = {};
  totalPuntos: any = 0;
  eje: any = 0;
  general: any = {
    publicacion: {},
    recompensa: {},
    referidos: {},
    Tareas: {},
    paquete: {},
    click: {}
  }
  ;

  constructor(
    private _Tablero: TableroService,
    private _model: FactoryModelService
  ) {
  }

  ngOnInit() {
    // console.log(this._model);
    const user: any  = JSON.parse(localStorage.getItem('user'));
    this._model.user = user;
    if(this._model.user){
      this.getPuntos();
      this.getPuntosRef();
      // this.getCantidadRef();
      this.getPaquetes();
      this.getRetiradoPuntos();
      this.getPublicaciones();
    }
  }
  getPuntos(){
    // console.log("men");
    const
      query: any = {
        estado: 'realizado',
        // user: this._model.user.id
      }
    ;
    return this._Tablero.getActividad(query)
    .subscribe(
      (res: any) =>{
        // console.log(res);
        const
          labels: any = [],
          datasets: any = []
        ;
        var
          flag: any = 0,
          total: any = 0
        ;
        _.forEach(res.data, function(item: any, val: any){
          if(item.valor){
            total+=item.valor;
          }
          _.forEach(labels, function(labels: any, i: any){
            // console.log(labels, moment(item.createdAt).format('DD/MM/YYYY'))
            if(labels.indexOf(moment(item.createdAt).format('DD/MM/YYYY')) > -1){
              datasets[i] += item.valor;
              flag++;
            }
          })
          ;
          if(flag === 0){
            labels.push(moment(item.createdAt).format('DD/MM/YYYY'));
            datasets.push(item.valor);
          }
          flag = 0;
        })
        ;
        // TODO Falta el de retirados y Disponibles
        this.general.recompensa.disponible = total;
        this.dataPuntos = new Chart('canvas', {
          type: 'bar',
          data: {
            labels: labels,
            datasets: [
              {
                data: datasets,
                borderColor: '#3cba9f',
                fill: false
              }
            ]
          },
          options: {
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                display: true
              }],
              yAxes: [{
                display: true
              }]
            }
          }
        })
        ;
        // console.log(this.dataPuntos);
      }
    )
    ;
  }
  getPuntosRef(){
    const
      query: any = {
        cabeza: this._model.user.id
      },
      _Tablero: any =this._Tablero
    ;
    var
      dataPuntosRef: any = this.dataPuntosRef
    ;
    return this._Tablero.getUserCabeza(query)
    .subscribe(
      (res: any) =>{
        // console.log(res);
        res = res.data;
        this.getCantidadRef(res);
        _.forEach(res, function(user){
          var query: any = {
            // user: user.id,
            estado: 'realizado',
          }
        ;
        // console.log(query);
          return _Tablero.getActividad(query)
          .subscribe(
            (res: any) =>{
              // console.log(res);
              const
                labels: any = [],
                datasets: any = []
              ;
              var
                flag: any = 0
              ;
              _.forEach(res.data, function(item, val){
                // _.forEach(labels, function(labels, i){
                //   // console.log(labels, moment(item.createdAt).format('DD/MM/YYYY'))
                //   if(labels.indexOf(item.user) > -1){
                //     datasets[i] += item.valor;
                //     flag++;
                //   }
                // })
                // ;
                if(flag === 0){
                  item.user = 'andres';
                  labels.push(item.user);
                  datasets.push(item.valor);
                }
                flag = 0;
              })
              ;
              dataPuntosRef = new Chart('canvas2', {
                type: 'bar',
                data: {
                  labels: labels,
                  datasets: [
                    {
                      data: datasets,
                      borderColor: '#3cba9f',
                      fill: false
                    }
                  ]
                },
                options: {
                  legend: {
                    display: false
                  },
                  scales: {
                    xAxes: [{
                      display: true
                    }],
                    yAxes: [{
                      display: true
                    }]
                  }
                }
              })
              ;
            }
          )
          ;
        })
        ;
      }
    )
    ;
  }
  getCantidadRef(res: any){
    // console.log(res);
    const
      labels: any = [],
      datasets: any = []
    ;
    var
      flag: any = 0,
      totalactivos: any = 0,
      totalinactivos: any = 0
    ;
    _.forEach(res, function(item, val){
      if(item.estado === 'activo'){
        totalactivos++;
      }else{
        totalinactivos++;
      }
      _.forEach(labels, function(labels, i){
        // console.log(labels, moment(item.createdAt).format('DD/MM/YYYY'))
        if(labels.indexOf(item.estado) > -1){
          datasets[i] += 1;
          flag++;
        }
      })
      ;
      if(flag === 0){
        labels.push(item.estado);
        datasets.push(1);
      }
      flag = 0;
    })
    ;
    this.general.referidos.activos = totalactivos;
    this.general.referidos.inactivos = totalinactivos;
    // console.log(labels, datasets)
    this.dataCantidadRef = new Chart('canvas3', {
      type: 'bar',
      data: {
        labels: labels,
        // labels:[
        //   'activos',
        //   'inactivos'
        // ],
        datasets: [
          {
            data: datasets,
            // data:[
            //   10,
            //   5
            // ],
            borderColor: '#3cba9f',
            fill: false
          }
        ]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }]
        }
      }
    })
    ;
  }
  getPaquetes(){
    const
      _Tablero = this._Tablero,
      dataPaquetes = this.dataPaquetes,
      general = this.general,
      query = {
        user: this._model.user.id
      }
    ;
    return this._Tablero.getPaquetes(query)
    .subscribe(
      (res: any) =>{
        // console.log(res);
        var
          estadis: any = {
            totalBasic: 0,
            totalEmprend: 0,
            totalLider: 0
          }
        ;
        _.forEach(res.data, function(item){
          _Tablero.populatePaquete(item.paquete)
          .subscribe(
            (res: any) =>{
              // console.log(res);
              next(res,dataPaquetes, general, estadis);
            }
          )
          ;
        })
        ;
      }
    )
    ;
    function next(res: any, dataPaquetes: any, general: any, estadis:any){
      // console.log(res);
      const
        labels: any = [],
        datasets: any = []
      ;
      var
        flag: any = 0
      ;
      _.forEach(res.data, function(item, val){
        // console.log(item);
        if(item.title === 'Paquete Basico'){
          estadis.totalBasic+=1;
          // console.log(estadis.totalBasic);
        }else if(item.title === 'Paquete Emprendedor'){
          estadis.totalEmprend+=1;
        }else{
          estadis.totalLider+=1;
        }
        _.forEach(labels, function(labels, i){
          // console.log(labels, moment(item.createdAt).format('DD/MM/YYYY'))
          if(labels.indexOf(item.title) > -1){
            datasets[i] += item.valor;
            flag++;
          }
        })
        ;
        if(flag === 0){
          labels.push(item.title);
          datasets.push(item.valor);
        }
        flag = 0;
      })
      ;
      // console.log(estadis.totalBasic);
      general.paquete.basico = estadis.totalBasic;
      general.paquete.emprendedor = estadis.totalEmprend;
      general.paquete.lider = estadis.totalLider;
      dataPaquetes = new Chart('canvas4', {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              data: datasets,
              borderColor: '#3cba9f',
              fill: false
            }
          ]
        },
        options: {
          legend: {
            display: false
          },
          scales: {
            xAxes: [{
              display: true
            }],
            yAxes: [{
              display: true
            }]
          }
        }
      })
      ;
    }
  }
  getRetiradoPuntos(){

  }
  getPublicaciones(){
    const
      query:any = {
        user: this._model.user.id
      }
    ;
    return this._Tablero.getPublicaciones(query)
    .subscribe(
      (res: any) =>{
        console.log(res);
      }
    )
    ;
  }

}
