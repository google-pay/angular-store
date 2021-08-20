/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItemDetails, StoreService } from '../store.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit {
  cart: CartItemDetails[] = [];

  get cartSize() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  get cartTotal() {
    return this.cart.reduce((total, item) => total + item.quantity * item.item.price, 0);
  }

  constructor(private storeService: StoreService, private router: Router) {}

  ngOnInit(): void {
    this.storeService.getCart().subscribe(cart => {
      this.cart = cart;
    });
  }

  onCheckout() {
    this.router.navigate(['/checkout']);
  }

  onRemove(cartItem: CartItemDetails) {
    this.storeService.removeCartItem(cartItem);
  }

  onQuantityChange(event: Event, cartItem: CartItemDetails) {
    const input = event.target as HTMLInputElement;
    this.storeService.updateCartItemQuantity({ ...cartItem, quantity: input.valueAsNumber });
  }
}
