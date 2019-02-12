import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { ToolsService } from 'src/app/dashboard-user/services/tools.service';
@Component({
  selector: 'app-registry',
  templateUrl: './registry.component.html',
  styleUrls: ['./registry.component.scss'],
  providers: [UserService]
})
export class RegistryComponent implements OnInit {
  private response: any;
  public cabeza: string;
  registerForm: FormGroup;
      loading = false;
      submitted = false;

      constructor(
          private formBuilder: FormBuilder,
          private router: Router,
          private activate: ActivatedRoute,
          private userService: UserService,
          private _authSrvice: AuthService,
          private _tools: ToolsService
      ) {
        if (this._authSrvice.isLoggedIn()) {
          this.router.navigate(['dashboard']);
        }
        this.cabeza = (this.activate.snapshot.paramMap.get('username'));
      }

      ngOnInit() {
          this.registerForm = this.formBuilder.group({
              name: ['', Validators.required],
              username: ['', Validators.required],
              lastname: ['', Validators.required],
              email: ['', Validators.required],
              celular: ['', [Validators.required, Validators.minLength(10)]],
              password: ['', [Validators.required, Validators.minLength(6)]],
              cabeza: [this.cabeza , [Validators.required]]
          });
      }

      // convenience getter for easy access to form fields
      get f() { return this.registerForm.controls; }

      onSubmit() {
          this.userService.register(this.registerForm.value).subscribe(
            (response: any) => {
              if (response.status === 200) {
                  localStorage.setItem('user', JSON.stringify(response.data));
                  this.router.navigate(['dashboard']);
              } else {
                this._tools.openSnack('No se pudo registrar porfavor verifica los datos', 'Error', false);
              }
            },
            error => {
              console.log(error);
              this._tools.openSnack('Los datos son incorrectos o el usuario ya existe', 'Error', false);
            }
          );
          // this.submitted = true;
          //
          // // stop here if form is invalid
          // if (this.registerForm.invalid) {
          //     return;
          // }
          //
          // this.loading = true;
          // // this.userService.register(this.registerForm.value)
          // //     .pipe(first())
          // //     .subscribe(
          // //         data => {
          // //             this.alertService.success('Registration successful', true);
          // //             this.router.navigate(['/login']);
          // //         },
          // //         error => {
          // //             this.alertService.error(error);
          // //             this.loading = false;
          // //         });
      }

}
