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
import { ActivatedRoute, Router } from '@angular/router';
import { ItemDetails, StoreService } from '../store.service';
import { MatSnackBar } from '@angular/material/snack-bar';

function unescapeHtml(text: string) {
  const elem = document.createElement('textarea');
  elem.innerHTML = text;
  return elem.textContent || '';
}

@Component({
  selector: 'app-item-details',
  templateUrl: './item-details.component.html',
  styleUrls: ['./item-details.component.scss'],
})
export class ItemDetailsComponent implements OnInit {
  item!: ItemDetails;
  size = 'M';
  sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];
  quantity = 1;
  quantityOptions = [1, 2, 3, 4, 5];

  get itemDescription() {
    return unescapeHtml(this.item.description);
  }

  constructor(
    private storeService: StoreService,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.storeService
      .getItem(this.route.snapshot.paramMap.get('listId')!, this.route.snapshot.paramMap.get('itemId')!)
      .subscribe(item => (this.item = item!));
  }

  onAddToCart() {
    this.storeService.addItemToCart(this.item, this.size, this.quantity);
    const snackbar = this.snackBar.open(`${this.item.title} added to cart.`, 'view cart', {
      duration: 5000,
    });
    snackbar.onAction().subscribe(() => {
      this.router.navigate(['/cart']);
    });
  }
}
