import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';
import { UserService } from '../../services/user.service';
import { ToolsService } from '../../services/tools.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {
  list: any = [];
  disabled: any = true;
  searchtext: any = '';
  cuerpo: any = {
    data: {
      plan: 'diario',
      tipdoc: 'cc'
    },
    lisplan: []
  };
  constructor(
    private _user: UserService,
    private _tools: ToolsService,
  ) {
  }

  ngOnInit() {
    this.get(false);
  }
  get(data: any){
    const
      query:any = {

      }
    ;
    if(data){
      if(this.searchtext){
        query.name= this.searchtext;
      }else{
        delete query.name;
      }
    }
    console.log(query);
    this._user.getUser(query)
    .subscribe(
      (res: any) =>{
        console.log(res);
        this.list = res.data;
        this.getPlan();
      }
    )
    ;
  }
  getPlan(){
    const
      query:any = {

      }
    ;
    this._user.getPlan(query)
    .subscribe(
      (res: any) =>{
        console.log(res);
        this.cuerpo.lisplan = res.data;
      }
    )
    ;
  }
  new(item){
    this.disabled = !this.disabled;
    if(item){
      console.log(item, this.cuerpo);
      this.cuerpo.data = item;
      // if(item.usuarioplan){
      //   const
      //     query:any = {
      //       id: item.usuarioplan
      //     }
      //   ;
      //   this._user.getUsuarioPlan(query)
      //   .subscribe(
      //     (res: any) =>{
      //       console.log(res);
      //       res = res.data[0];
      //       if(res){
      //         const
      //           idx: any = _.findIndex(this.cuerpo.lisplan, [ 'id', res.plan])
      //         ;
      //         console.log(idx);
      //         if(idx >= -1){
      //           console.log(this.cuerpo.lisplan[idx]);
      //           item.usuarioplan = this.cuerpo.lisplan[idx];
      //         }
      //       }
      //       console.log(item);
      //       this.cuerpo.data = item;
      //     }
      //   );
      // }
    }
  }
  createuser(){
    // console.log(this.cuerpo.data);
    const
      query: any = this.cuerpo.data,
      cuerpo: any = this.cuerpo
    ;
    query.slug = _.kebabCase(query.name);
    query.password = 123456;
    query.empresa = '5c61cff74762af06d4cafb09';
    // console.log(query);
    this._user.pushUser(query)
    .subscribe(
      (res: any) =>{
        console.log(res);
        if(res.id){
          this.list.push(res);
          this.disabled = !this.disabled;
          this.cuerpo.data = {};
          this._tools.openSnack('Agregado Correctamente', 'Error' , false);
          this.edit(cuerpo, 'usuarioplan');
        }
      }
    )
    ;
  }
  edit(data: any, obj: any){
    console.log(data, obj, this._user);
    if(data.data){
      if(data.data.id){
        const
          query: any = {
            id: data.data.id
          }
        ;
        query[obj]=data.data[obj];
        ;
        console.log(query);
        if(obj === 'usuarioplan'){
          this._user.pushPlan(data, query)
          .subscribe(
            (response: any) =>{
              const
                data: any = {
                  id: query.id,
                  usuarioplan: response.id
                }
              ;
              console.log(response, data);
              this._user.putUser(data)
              .subscribe(
                (rta: any) =>{
                  console.log(rta);
                }
              );
            }
          );
        }else{
          this._user.putUser(query)
          .subscribe(
            (rta: any) =>{
              console.log(rta);
            }
          );
        }
      }
    }
  }


}
