import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { 
    this.totalPrice = JSON.parse(localStorage.getItem("totalPrice"));
    this.totalQuantity = JSON.parse(localStorage.getItem("totalQuantity"));
  }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus() {
    // subscribe to the cart totalPrice and totalQuantity
    this.cartService.totalPrice.subscribe(
      (data) => {
        this.totalPrice = data;
      }
    );

    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );
  }

}
