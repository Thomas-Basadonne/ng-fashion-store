import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Product } from '../../../types';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    ProductComponent,
    CardModule,
    ButtonModule,
    RatingModule,
    FormsModule,
    ButtonModule,
    DialogModule,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  @Input() product!: Product;
  @Output() edit: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() delete: EventEmitter<Product> = new EventEmitter<Product>();

  editProduct() {
    this.edit.emit(this.product);
  }

  deleteProduct() {
    this.delete.emit(this.product);
  }
}
