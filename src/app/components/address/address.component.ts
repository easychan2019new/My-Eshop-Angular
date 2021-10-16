import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Address } from 'src/app/common/address';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { User } from 'src/app/common/user';
import { AddressService } from 'src/app/services/address.service';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.css']
})
export class AddressComponent implements OnInit {

  addressFormGroup: FormGroup;
  user: User = null;

  countries: Country[] = [];
  states: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private addressService: AddressService,
              private router: Router) { }

  ngOnInit(): void {

    this.addressFormGroup = this.formBuilder.group({
      address: this.formBuilder.group({
        contactName: new FormControl('', [Validators.required, Validators.minLength(2)]),
        contactPhone: new FormControl('', [Validators.required, Validators.minLength(10)]),
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, Validators.minLength(2)]),
        city: new FormControl('', [Validators.required, Validators.minLength(2)]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2)]),
      })
    });

    // populate countries
    this.addressService.getCountries().subscribe(
      data => {
        this.countries = data;
      }
    );
  }

  refreshState() {
    // populate states based on current country
    const addressFormGroup = this.addressFormGroup.get("address");
    let countryName: string = addressFormGroup.value.country;
    console.log(countryName);
    this.addressService.getStates(countryName).subscribe(
      data => {
        this.states = data;
      }
    );
  }


  onSubmit() {

    if (this.addressFormGroup.invalid) {
      console.log("Something wrong!");
      this.addressFormGroup.markAllAsTouched();
      return;
    }

    let address = new Address();
    address = this.addressFormGroup.get('address').value;  

    this.user = JSON.parse(localStorage.getItem('user'));
    address.userEmail = this.user.email;
    console.log(address);

    this.addressService.addAddress(address).subscribe(
      {
        next: response => {
          alert(`Your address has been added successfully!`);
          this.router.navigate(['checkout']);
        },
        error: err => {
          alert(`Adding payment failed: ${err.message}`);
        }
      }
    );
  }

  get addressContactName() { return this.addressFormGroup.get('address.contactName')};
  get addressContactPhone() { return this.addressFormGroup.get('address.contactPhone')};
  get addressCountry() { return this.addressFormGroup.get('address.country')};
  get addressStreet() { return this.addressFormGroup.get('address.street')};
  get addressCity() { return this.addressFormGroup.get('address.city')};
  get addressState() { return this.addressFormGroup.get('address.state')};
  get addressZipCode() { return this.addressFormGroup.get('address.zipCode')};

}
