import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
// import firebase from 'firebase';
// import * as firebaseui from 'firebaseui';
import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login-test.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  ui: firebaseui.auth.AuthUI;

  constructor(public afAuth: AngularFireAuth,
              private router: Router, 
              public authService: AuthService) { }

  ngOnInit(): void {
    //this.authService.getUserDetail();
    const uiConfig = {

      signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      ],

      callbacks: {
        signInSuccessWithAuthResult: this.onLoginSuccessful.bind(this)

      }
    };
    
    // if (this.ui == null) {
    //   this.ui = new firebaseui.auth.AuthUI(firebase.auth()); 
    // }
    this.ui = firebaseui.auth.AuthUI.getInstance() || 
              new firebaseui.auth.AuthUI(firebase.auth())

    this.ui.start('#firebaseui-auth-container', uiConfig)

    this.ui.disableAutoSignIn();
  }

  onLoginSuccessful() {
    this.router.navigateByUrl(`/products`);
    // this.router.navigate(['search/Python']);
  }

  ngOnDestroy(): void {
    this.ui.delete;
  }
}
