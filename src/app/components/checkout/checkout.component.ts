import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AddressDisplay } from 'src/app/common/address-display';
import { CartItem } from 'src/app/common/cart-item';
import { PaymentDisplay } from 'src/app/common/payment-display';
import { Purchase } from 'src/app/common/purchase';
import { User } from 'src/app/common/user';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;
  totalQuantity: number = 0;
  totalPrice: number = 0;
  user: User = null;
  cartItems: Set<CartItem> = new Set();

  paymentList: PaymentDisplay[] = [];
  addressList: AddressDisplay[] = [];

  constructor(private formBuilder: FormBuilder,
              private cartService: CartService,
              private checkoutService: CheckoutService,
              private router: Router) { 

      // this.totalPrice = JSON.parse(localStorage.getItem("totalPrice"));
      // this.totalQuantity = JSON.parse(localStorage.getItem("totalQuantity"));

              }

  ngOnInit(): void {

    this.reviewCartDetails();

    // build check out form
    this.checkoutFormGroup = this.formBuilder.group({
      checkoutPayment: this.formBuilder.group({
        selectPayment: new FormControl('', Validators.required)
      }),
      checkoutAddress: this.formBuilder.group({
        selectAddress: new FormControl('', Validators.required)
      })
    });

    // get user's payment list
    this.checkoutService.getPayments().subscribe(
      data => {
        this.paymentList = data;
      }
    );

    // get user's address list
    this.checkoutService.getAddresses().subscribe(
      data => {
        this.addressList = data;
      }
    )
    

  }

  onSubmit() {

    if (this.checkoutFormGroup.invalid) {
      console.log("Something wrong!");
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // console.log(this.checkoutFormGroup.get('chekcoutPayment').value);
    this.user = JSON.parse(localStorage.getItem('user'));
    this.cartItems = JSON.parse(localStorage.getItem('cartItems'));


    // process dto purchase
    let purchae = new Purchase();
    purchae.addressId = this.checkoutFormGroup.get("checkoutAddress").value.selectAddress;
    purchae.paymentId = this.checkoutFormGroup.get("checkoutPayment").value.selectPayment;
    purchae.customerEmail = this.user.email;
    purchae.totalPrice = JSON.parse(localStorage.getItem('totalPrice'));
    purchae.totalQuantity = JSON.parse(localStorage.getItem('totalQuantity'));
    purchae.cartItems = this.cartItems;

    console.log(purchae);
  
    // call the rest API
    this.checkoutService.placeOrder(purchae).subscribe(
      {
        next: response => {
          alert(`Your order has been submitted successfully! The orderId is ${response.response}`);
          this.router.navigate(['order-history']);
        },
        error: err => {
          alert(`Placing order failed: ${err.message}`);
        }
      }
    );

  }

  reviewCartDetails() {
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

  get checkoutPaymentSelectPayment() { return this.checkoutFormGroup.get('checkoutPayment.selectPayment')};
  get checkoutAddressSelectAddress() { return this.checkoutFormGroup.get('checkoutAddress.selectAddress')};

}
