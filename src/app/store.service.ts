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

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

export interface CategoryDetails {
  name: string;
  title: string;
  image: string;
}

export interface ItemDetails {
  name: string;
  title: string;
  category: string;
  price: number;
  description: string;
  image: string;
  largeImage: string;
}

export interface CartItemDetails {
  item: ItemDetails;
  size: string;
  quantity: number;
}

const categories: CategoryDetails[] = [
  {
    name: 'mens_outerwear',
    title: 'Mens Outerwear',
    image: '/assets/images/categories/mens_outerwear.jpg'
  },
  {
    name: 'ladies_outerwear',
    title: 'Ladies Outerwear',
    image: '/assets/images/categories/ladies_outerwear.jpg'
  },
  {
    name: 'mens_tshirts',
    title: 'Mens T-Shirts',
    image: '/assets/images/categories/mens_tshirts.jpg'
  },
  {
    name: 'ladies_tshirts',
    title: 'Ladies T-Shirts',
    image: '/assets/images/categories/ladies_tshirts.jpg'
  }
];

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private itemsCache: Map<string, Observable<ItemDetails[]>>;
  private cart: CartItemDetails[];
  private cartSubject?: Subject<CartItemDetails[]>;

  constructor(private http: HttpClient) {
    this.itemsCache = new Map();
    this.cart = [];
  }

  private getStorage<T>(key: string): T {
    return JSON.parse(localStorage.getItem(key) || 'null');
  }

  private setStorage<T>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getCategories() {
    console.log(categories);
    return from([categories]);
  }

  getItemsByCategory(name: string) {
    let cat = this.itemsCache.get(name);
    if (cat) return cat;

    cat = this.http.get<ItemDetails[]>(`/assets/data/${name}.json`);
    this.itemsCache.set(name, cat);

    return cat;
  }

  getItem(category: string, name: string) {
    return this.getItemsByCategory(category).pipe(mergeMap(items => from([items.find(item => item.name === name)])));
  }

  addItemToCart(item: ItemDetails, size: string, quantity: number) {
    let existing = this.cart.find(c => c.item.name === item.name && c.size === size);

    if (!existing) {
      this.cart = [
        ...this.cart,
        {
          item,
          size,
          quantity
        }
      ];
    } else {
      existing.quantity += quantity;
      this.cart = [...this.cart];
    }

    this.setCart(this.cart);
  }

  removeCartItem(cartItem: CartItemDetails) {
    this.cart = this.cart.filter(c => !(c.item.name === cartItem.item.name && c.size === cartItem.size));

    this.setCart(this.cart);
  }

  updateCartItemQuantity(cartItem: CartItemDetails) {
    let existing = this.cart.find(c => c.item.name === cartItem.item.name && c.size === cartItem.size);

    if (!existing) {
      this.cart = [...this.cart, cartItem];
    } else {
      existing.quantity = cartItem.quantity;
      this.cart = [...this.cart];
    }

    this.setCart(this.cart);
  }

  getCart(): Observable<CartItemDetails[]> {
    if (!this.cartSubject) {
      this.cart = this.getStorage<CartItemDetails[]>('cart') || [];
      this.cartSubject = new BehaviorSubject(this.cart);
    }
    return this.cartSubject;
  }

  setCart(cart: CartItemDetails[]) {
    this.cart = cart;
    this.cartSubject!.next(cart);
    this.setStorage('cart', cart);
  }

  /** Mock service to process order */
  processOrder(cart: CartItemDetails[], paymentData: any) {
    console.log(
      'TODO: send order to server',
      cart,
      paymentData.shippingAddress,
      paymentData.shippingOptionData?.id,
      paymentData.paymentMethodData
    );

    return Promise.resolve({
      orderId: Date.now().valueOf().toString()
    });
  }
}
