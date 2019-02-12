import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ToolsService } from 'src/app/dashboard-user/services/tools.service';
import { FactoryModelService } from 'src/app/dashboard-user/services/factory-model.service';
import * as _ from 'lodash';
import { GLOBAL } from './../../services/global';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public user;
  private response: any;
  public url: string;
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  // public _publicacion: any;
  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private _userService: UserService,
      private _authSrvice: AuthService,
      private _tools: ToolsService,
      private _model: FactoryModelService
  ) {
    this.user = {};
    if (this._authSrvice.isLoggedIn()) {
      this.router.navigate(['dashboard']);
    }
    this._model.get('user', false)
    .subscribe(
      (response: any) => {
          if (response.length > 0) {
            return true;
          } else {
            this.crearRolDefault();
          }
      },
      (error: any) => {
          console.log('Error', error);
      }
    );
    this.url = GLOBAL.url;
  }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
          username: ['', Validators.required],
          password: ['', Validators.required]
      });
      this._model.get('paquete', false)
      .subscribe(
        (response: any) => {
            if (response.length > 0) {
              return true;
            } else {
              this.crearPaquetes();
            }
        },
        (error: any) => {
            console.log('Error', error);
        }
      );
      // // get return url from route parameters or default to '/'
      // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    this._userService.login(this.loginForm.value).subscribe(
      (response: any) => {
        if (response.success) {
          console.log(response);
          localStorage.setItem('user', JSON.stringify(response.data));
          this.router.navigate(['dashboard']);
        } else {
          this._tools.openSnack('El usuario no se encontro', 'Error', false);
        }
      },
      error => {
        this._tools.openSnack('Algo a salido mal', 'Error', false);
        console.log(<any>error);
      }
    );
    // this.user = this.userService.login()
      // this.submitted = true;
      //
      // // stop here if form is invalid
      // if (this.loginForm.invalid) {
      //     return;
      // }
      //
      // this.loading = true;
      // // this.authenticationService.login(this.f.username.value, this.f.password.value)
      // //     .pipe(first())
      // //     .subscribe(
      // //         data => {
      // //             this.router.navigate([this.returnUrl]);
      // //         },
      // //         error => {
      // //             this.alertService.error(error);
      // //             this.loading = false;
      // //         });

  }




  // form:FormGroup;
  // constructor(private fb:FormBuilder,
  //               private authService: AuthService,
  //               private router: Router) {
  //
  //      this.form = this.fb.group({
  //          email: ['',Validators.required],
  //          password: ['',Validators.required]
  //      });
  //  }
  //
  // ngOnInit() {
  // }
  //
  // login() {
  //       const val = this.form.value;
  //
  //       if (val.email && val.password) {
  //           this.authService.login(val.email, val.password)
  //               .subscribe(
  //                   () => {
  //                       console.log("User is logged in");
  //                       this.router.navigateByUrl('/');
  //                   }
  //               );
  //       }
  //   }
  private crearRolDefault() {
    const roles = [
      {nombre: 'user', descripcion: 'rol general para los usuarios'}
    ];
    _.forEach(roles, (item: any) => {
      this._model.create('rol', item)
      .subscribe(
        (response: any) => {
            this._tools.openSnack('Roles creados', 'ok', false);
            console.log(response);
            this.crearNiveles();
        },
        (error: any) => {
            console.log('Error', error);
        }
      );
    });
  }
  private crearUserDefault() {
    const users = [
      {name: 'origin', lastname: 'origin', username: 'origin', email: 'luisalbertoj.tober@gmail.com', password: '123456'}
    ];
    _.forEach(users, (item: any) => {
      this._model.create('user', item)
      .subscribe(
        (response: any) => {
            this._tools.openSnack('Usuarios creados', 'ok', false);
            console.log(response);
        },
        (error: any) => {
            console.log('Error', error);
        }
      );
    });
  }
  private crearNiveles() {
    const niveles = [
      {title: 'Plata'},
      {title: 'Oro'},
      {title: 'Diamante'},
      {title: 'Lider'}
    ];
    _.forEach(niveles, (item: any) => {
      this._model.create('nivel', item)
      .subscribe(
        (response: any) => {
            this._tools.openSnack('Niveles creados', 'ok', false);
            console.log(response);
            this.crearUserDefault();
        },
        (error: any) => {
            console.log('Error', error);
        }
      );
    });
  }
  private crearPaquetes() {
    const paquetes = [
      {
        ref: 1,
        title: 'Paquete Basico',
        subtitle: '',
        description: `
          Paquete para nuevos emprendedores
          - 1 a 10 referidos
          - 2 niveles de profundidad
        `,
        valor: 25000
      },
      {
        ref: 2,
        title: 'Paquete Emprendedor',
        subtitle: '',
        description: `
          Paquete para nuevos emprendedores
          - 11 a 20 referidos
          - 3 niveles de profundidad
        `,
        valor: 60000
      },
      {
        ref: 3,
        title: 'Paquete Lider',
        subtitle: '',
        description: `
          Paquete para nuevos emprendedores
          - 21 a 30 referidos
          - 6 niveles de profundidad
        `,
        valor: 120000
      }
    ];
    _.forEach(paquetes, (item: any) => {
      this._model.create('paquete', item)
      .subscribe(
        (response: any) => {
            this._tools.openSnack('paquetes creados', 'ok', false);
            console.log(response);
        },
        (error: any) => {
            console.log('Error', error);
        }
      );
    });
  }

}
