/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../store.service';
import { NgForm } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  firstName: string = '';
  lastName: string = '';
  address1: string = '';
  address2: string = '';
  city: string = '';
  state: string = '';
  zip: string = '';
  country: string = '';
  cardName: string = '';
  cardNumber: string = '';
  expDate: string = '';
  cvv: string = '';

  constructor(private router: Router, private storeService: StoreService) {}

  ngOnInit(): void {}

  async onSubmit(event: Event, form: NgForm) {
    event.preventDefault();

    this.storeService
      .getCart()
      .pipe(first())
      .subscribe(
        async cartItems => {
          await this.storeService.processOrder(cartItems, {
            shippingAddress: {
              address1: this.address1,
              address2: this.address2,
              administrativeArea: this.state,
              countryCode: this.country,
              locality: this.city,
              postalCode: this.zip
            },
            paymentMethodData: {
              type: 'CARD_NUMBER',
              card: {
                csc: this.cvv,
                exp: this.expDate,
                name: this.cardName,
                number: this.cardNumber
              }
            }
          });
        },
        error => {},
        () => {
          this.storeService.setCart([]);
          this.router.navigate(['/confirm']);
        }
      );
  }
}
