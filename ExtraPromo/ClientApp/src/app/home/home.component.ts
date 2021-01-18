import { UserLoginDto } from '../_DTOs/userLoginDto';

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { UserLoginResponse } from '../_DTOs/responses/userLoginResponse';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup

  constructor(
    private _formBuilder: FormBuilder,
    private _alertifyService: AlertifyService,
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
    this.createLoginForm();
  }

  private createLoginForm(): void {
    this.loginForm = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  login(): void {
    const userLoginDto: UserLoginDto = Object.assign({}, this.loginForm.value);;
    if (!this.loginForm.valid)
      return;

    this._authService.login(userLoginDto).subscribe((response: any) => {
      const loginResponse: UserLoginResponse = Object.assign({}, response);;
      if (!loginResponse.status) {
        this._alertifyService.error(loginResponse.message ?? "Invalid username/password combination.");
      } else {
        this._alertifyService.success(loginResponse.message ?? "Successfully logged in.");
      }
    },
      error => {
        this._alertifyService.error("Unknown error.");
        console.log(error.message);
      }
    );
  }
}
