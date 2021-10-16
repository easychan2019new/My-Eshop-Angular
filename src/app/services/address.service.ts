import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Address } from '../common/address';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  private baseUrl = 'http://localhost:8082/user-service/address';

  constructor(private httpClient: HttpClient) { }

  getCountries(): Observable<Country[]> {

    const countryUrl = `${this.baseUrl}/country`;

    return this.httpClient.get<Country[]>(countryUrl);
  }

  getStates(countryName: string): Observable<State[]> {

    const stateUrl = `${this.baseUrl}/state?countryName=${countryName}`;
    return this.httpClient.get<State[]>(stateUrl);
  }

  addAddress(address: Address): Observable<any> {

    const addAddressUrl = `${this.baseUrl}/addAddress`;
    return this.httpClient.post<Address>(addAddressUrl, address);
  }
}
