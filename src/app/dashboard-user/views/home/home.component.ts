import { Component, OnInit } from '@angular/core';
import { FactoryModelService } from '../../services/factory-model.service';
import { User } from '../../models/User';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  private response: any;
  private user: User;
  constructor(
    private _Model: FactoryModelService
  ) {
/*     this.user = new User('', 'prueba', 'prueba', 'prueba', 'prueba@prueba.mail.com', 'prueba', '', '', '');
 */   }

  ngOnInit() {
    /* this.crear(); */
  }

  /* crear() {
    this._Model.create('user', this.user).subscribe(
      response => {
        this.response = response;
        console.log(this.response);
        this.actualizar();
      },
      error => {
        console.log(error);
      }
    );
  }
  actualizar() {
    this.user.name = 'pepe';
    this._Model.update('user', this.response.id, this.user).subscribe(
      response => {
        this.response = response;
        console.log(this.response);
        this.borrar();
      },
      error => {
        console.log(error);
      }
    );
  }

  borrar() {
    this._Model.delete('user', this.response.id, this.user).subscribe(
      response => {
        this.response = response;
        console.log(this.response);
        this.traer();
      },
      error => {
        console.log(error);
      }
    );
  }

  traer() {
    try {
      this._Model.get('user', '').subscribe(
        response => {
          this.response = response;
          console.log(this.response);
        },
        error => {
          console.log(error);
        }
      );
    } catch (e) {
      console.log(e);
    }
  } */

}
