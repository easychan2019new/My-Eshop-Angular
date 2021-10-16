import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Payment } from 'src/app/common/payment';
import { User } from 'src/app/common/user';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  paymentFormGroup: FormGroup;
  user: User = null;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];

  constructor(private formBuilder: FormBuilder,
              private paymentService: PaymentService,
              private router: Router) { }

  ngOnInit(): void {

    this.paymentFormGroup = this.formBuilder.group({
      payment: this.formBuilder.group({
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        name: new FormControl('', [Validators.required, Validators.minLength(2)]),
        validUntilYear: new FormControl('', [Validators.required]),
        validUntilMonth: new FormControl('', [Validators.required]),
        cvv: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
      })
    });

    // populate credit card months and years
    const startMonth: number = new Date().getMonth() + 1;
    this.paymentService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );
    this.paymentService.getCreditCardYears().subscribe(
      data => {
        this.creditCardYears = data;
      }
    );
  }

  onSubmit() {

    if (this.paymentFormGroup.invalid) {
      console.log("Something wrong!");
      this.paymentFormGroup.markAllAsTouched();
      return;
    }

    let payment = new Payment();
    payment = this.paymentFormGroup.get('payment').value;
    this.user = JSON.parse(localStorage.getItem('user'));
    payment.userEmail = this.user.email;
    console.log(payment);

    this.paymentService.addPayment(payment).subscribe(
      {
        next: response => {
          alert(`Your payment has been added successfully!`);
          this.router.navigate(['checkout']);
        },
        error: err => {
          alert(`Adding payment failed: ${err.message}`);
        }
      }
    );

  }

  handleMonthsAndYears() {
    const paymentFormGroup = this.paymentFormGroup.get("payment");

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(paymentFormGroup.value.validUntilYear);

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.paymentService.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;
      }
    );
  }

  get paymentCardNumber() { return this.paymentFormGroup.get('payment.cardNumber')};
  get paymentName() { return this.paymentFormGroup.get('payment.name')};
  get paymentValidUntilYear() { return this.paymentFormGroup.get('payment.validUntilYear')};
  get paymentValidUntilMonth() { return this.paymentFormGroup.get('payment.validUntilMonth')};
  get paymentCvv() { return this.paymentFormGroup.get('payment.cvv')};
}
