import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { OrderItem } from 'src/app/common/order-item';
import { OrderService } from 'src/app/services/order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {

  orderItems: OrderItem[] = [];

  constructor(private orderService: OrderService,
              private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe(() => {
      this.handleOrderDetails();
    })
  }

  handleOrderDetails() {
    const orderId: string = this.router.snapshot.paramMap.get("id");
    // console.log(orderId);

    this.orderService.getOrderDetails(orderId).subscribe(
      data => {
        this.orderItems = data;
      }
    );

  }

}
