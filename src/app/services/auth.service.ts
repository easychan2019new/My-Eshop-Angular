import { asNativeElements, Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { firebase, firebaseui, FirebaseUIModule } from 'firebaseui-angular';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { from, Observable, of, Subject } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { User } from '../common/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  name: string = null;
  email: string = null;
  userData: User = null; // Save logged in user data
  
  isAuthenticated: Subject<boolean> = new Subject<boolean>();
  userName: Subject<string> = new Subject<string>();

  constructor(public afAuth: AngularFireAuth,
              private router: Router, 
              public ngZone: NgZone) { 
                this.afAuth.authState.subscribe(user => {
                  if (user) {

                    this.SetUserData(user);
                    console.log(this.userData);

                    this.userName.next(user.displayName);
                    this.isAuthenticated.next(true);
                  } else {

                    localStorage.setItem('user', null);

                    this.isAuthenticated.next(false)
                    this.userName.next(null);
                  }
                })
              }

    ngOnInit(): void {
      this.isAuthenticated.next(this.isLoggedIn);
    }

  // Sign in with email/password
  // SignIn(email, password) {
  //   console.log("Within SideIn")
  //   return this.afAuth.signInWithEmailAndPassword(email, password)
  //     .then((result) => {
  //       this.ngZone.run(() => {
  //         console.log("Within SideIn")
  //         this.router.navigate(['search/Python']);
  //       });
  //       this.SetUserData(result);
  //       // this.isAuthenticated.next(this.isLoggedIn);
  //     }).catch((error) => {
  //       window.alert(error.message)
  //     })
  // } 

  async SignIn(email:string, password: string) {
    console.log("Within SideIn")
    return await this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          console.log("Within SideIn")
          this.router.navigate(['search/Python']);
        });
        this.SetUserData(result);
        // this.isAuthenticated.next(this.isLoggedIn);
      }).catch((error) => {
        window.alert(error.message)
      })
  } 

  // Sign up with email/password
  SignUp(email, password) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        /* Call the SendVerificaitonMail() function when new user sign 
        up and returns promise */
      }).catch((error) => {
        window.alert(error.message)
      })
  }

  // SignOut method for logging out from the Angular/Firebase app
  SignOut() {
    return this.afAuth.signOut().then(() => {
      this.userData = null;
      localStorage.removeItem('user');
      // this.isAuthenticated.next(this.isLoggedIn);
      console.log("logout!");
      this.router.navigate(['products']);
    })
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user != null ? true : false;
  }

  getUserDetail() {
    // this.userData = this.afAuth.currentUser;
    this.afAuth.authState.subscribe(
      (user) => {
        this.name = user.displayName;
        this.email = user.email;
        // console.log(user);
        this.userName.next(this.name);
      }
    )
    console.log("hello");
    // this.afAuth.currentUser.then(
    //   res => {
    //     this.name = res.email;
    //   }
    // )
    console.log(this.name);
    console.log(this.email);
  }

  SetUserData(user: any) {
    this.userData = new User();
    this.userData.uid = user.uid;
    this.userData.email = user.email;
    this.userData.name = user.displayName;
    localStorage.setItem('user', JSON.stringify(this.userData));
  }

}
