import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Product } from '../../../types';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    ProductComponent,
    CardModule,
    ButtonModule,
    RatingModule,
    FormsModule,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  @Input() product!: Product;
}
