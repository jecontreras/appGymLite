import { Component, OnInit } from '@angular/core';
import { PerfilService } from './../../services/perfil.service';
import { GLOBAL } from './../../../services/global';
import * as _ from 'lodash';
import { FactoryModelService } from '../../services/factory-model.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
  providers: [PerfilService]
})
export class PerfilComponent implements OnInit {

  public cuerpo: any;
  public img: any;
  public global  =  GLOBAL;
  public url: string = GLOBAL.urlFront;
  public datafile: any;
  public user: any = this._model.user;
  constructor(
      private _perfil: PerfilService,
      private _model: FactoryModelService
  ) {
    this.cuerpo = _perfil.rta;
    // console.log(_perfil, this.cuerpo);
  }

  ngOnInit() {
    this._perfil.loadUser();
  }
  datafiles(ev) {
    this.datafile = ev.target.files;
    // console.log(this.datafile);
  }
  file(ev) {
    // console.log(ev, this._perfil);
    if (this.img) {
      const
        cuerpo = this.cuerpo,
        _perfil = this._perfil,
        file = this.datafile
      ;
      // console.log(file);
      _perfil.pushfile(cuerpo, file)
      .subscribe(
        data => {
            // console.log(cuerpo);
            // console.log('POST Request is successful ', data);
            if (data[0]) {
              const urllogo = _.split(data[0].fd, 'images', 10);
              cuerpo._tools.openSnack('Agregado Foto de Perfil', false);
              // console.log(cuerpo.data, urllogo);
              deletefile(cuerpo, _perfil);
              cuerpo.data.foto = GLOBAL.url + 'images' + urllogo[1];
              // console.log(cuerpo.data.foto);
              cuerpo.btn.edit(cuerpo, 'foto');
            }
        },
        error => {
            console.log('Error', error);
        }
    );
    }
    function deletefile(cuerpo: any, _perfil: any) {
      if (cuerpo.data.foto) {
        const
          urldelete = _.split(cuerpo.data.foto, '/', 10)
        ;
        // console.log(urldelete, cuerpo);
        console.log(_perfil)
        _perfil.deletefile(cuerpo, urldelete[3])
        .subscribe(
          data => {
            console.log(data);
          }
        )
        ;
      }
    }
  }
}
