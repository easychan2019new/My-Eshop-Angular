import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(private authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    
    // add access token for secured endpoints

    // const securedEndpoints = ['http://localhost:8082/product-query-service/products/search'];
    const securedEndpoints = ['http://localhost:8082/order-query-service/order'];
    // const securedEndpoints = ['http://localhost:8080/api/users'];

    if (securedEndpoints.some(url => request.urlWithParams.includes(url))) {     

      let accessToken = null;
      if (this.authService.isLoggedIn) {

        accessToken = await (await this.authService.afAuth.currentUser).getIdToken();

        // console.log(accessToken);
        
        // clone the request and add new header with access token
        request = request.clone({
          setHeaders: {
            Authorization: "Bearer " + accessToken
          }
        });
      }
    }
    return next.handle(request).toPromise();
  }
}
