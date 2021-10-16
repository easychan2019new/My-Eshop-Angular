import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { AddressDisplay } from '../common/address-display';
import { PaymentDisplay } from '../common/payment-display';
import { Purchase } from '../common/purchase';
import { User } from '../common/user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private baseUrl = `http://localhost:8082/user-service/`;

  user: User;

  constructor(private httpClient: HttpClient,
              private authService: AuthService
              ) {
                this.user = JSON.parse(localStorage.getItem('user'));
               }


  ngOnInit(): void  { 
  }

  getPayments(): Observable<PaymentDisplay[]> {
    const theUrl = `${this.baseUrl}payment/findPaymentMethod?email=${this.user.email}`;
    return this.httpClient.get<PaymentDisplay[]>(theUrl);
  }

  getAddresses(): Observable<AddressDisplay[]> {
    const theUrl = `${this.baseUrl}address/findAddressChoice?email=${this.user.email}`;
    return this.httpClient.get<AddressDisplay[]>(theUrl);
  }

  placeOrder(purchase: Purchase):Observable<any> {
    const orderUrl = `http://localhost:8082/order-command-service/order/createOrder`;
    return this.httpClient.post<Purchase>(orderUrl, purchase);
  }
}
