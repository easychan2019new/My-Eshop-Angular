import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { OrderItem } from '../common/order-item';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private baseUrl = 'http://localhost:8082/order-query-service/order';

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(email: string): Observable<OrderHistory[]> {

    const orderHistoryUrl = `${this.baseUrl}/history?email=${email}`;

    return this.httpClient.get<OrderHistory[]>(orderHistoryUrl);
  }

  getOrderDetails(orderId: string): Observable<OrderItem[]> {
    const orderDetailsUrl = `${this.baseUrl}/orderItem?orderId=${orderId}`;
    // console.log(orderDetailsUrl);
    return this.httpClient.get<OrderItem[]>(orderDetailsUrl);
  }
}
