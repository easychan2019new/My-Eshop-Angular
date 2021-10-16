import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { User } from 'src/app/common/user';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  user: User = null;
  orderHistoryList: OrderHistory[] = [];

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.handleOrderHistory();
  }

  handleOrderHistory() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.orderService.getOrderHistory(this.user.email).subscribe(
      data => {
        this.orderHistoryList = data;
      }
    );
  }

}
