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

import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartItemDetails, CategoryDetails, StoreService } from '../store.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Input() categories!: CategoryDetails[];
  cart: CartItemDetails[] = [];

  get cartSize() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  constructor(private router: Router, private storeService: StoreService) {}

  onMenuClick(event: Event, category: CategoryDetails) {
    this.router.navigate(['/list', category.name]);
  }

  onCartClick() {
    this.router.navigate(['/cart']);
  }

  ngOnInit(): void {
    this.storeService.getCart().subscribe(cart => {
      this.cart = cart;
    });
  }
}
