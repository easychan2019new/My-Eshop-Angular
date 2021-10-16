import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth, AngularFireAuthModule } from '@angular/fire/auth';;
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean;
  userName: string = null;

  constructor(private router: Router, 
              private authService: AuthService,
              public afAuth: AngularFireAuth,
              private httpClient: HttpClient) { }

  ngOnInit(): void {

    // this.isAuthenticated = this.authService.afAuth.authState;

    this.authService.isAuthenticated.subscribe(
      data => this.isAuthenticated = data
    );

    this.authService.userName.subscribe(
      (data) => {
        this.userName = data;
      })
    
  }

  login() {
    this.router.navigateByUrl(`/sign-in`);
  }

  logout() {
    this.authService.SignOut();
  }

  // test() {
  //   console.log("hello");
  //   this.httpClient.get<any>('http://localhost:8080/api/users/findUser?uid=sdssss').subscribe(
  //     data => {
  //       console.log(data);
  //     }
  //   )
  // }
}
