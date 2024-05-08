import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Product } from '../../../types';

import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopup, ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { PricePipe } from '../../pipes/price.pipe';

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
    ConfirmPopupModule,
    TruncatePipe,
    PricePipe,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent {
  // DI service PrimeNg
  constructor(private confirmationService: ConfirmationService) {}

  @ViewChild('deleteButton') deleteButton: any; // Referenza al pulsante di eliminazione

  @Input() product!: Product; // Input per il prodotto da visualizzare

  // Eventi emessi quando si modifica o elimina il prodotto
  @Output() edit: EventEmitter<Product> = new EventEmitter<Product>();
  @Output() delete: EventEmitter<Product> = new EventEmitter<Product>();

  // Metodo di modifica che emette l'evento 'edit' con il prodotto da modificare
  editProduct() {
    this.edit.emit(this.product);
  }

  // Metodo per confermare l'eliminazione del prodotto
  confirmDelete() {
    this.confirmationService.confirm({
      target: this.deleteButton.nativeElement, // Specifica il pulsante di eliminazione come target per la conferma
      message: 'Sei sicuro di voler eliminare il prodotto?',
      accept: () => {
        this.deleteProduct(); // Chiama il metodo per eliminare il prodotto
      },
    });
  }

  // Metodo per eliminare effettivamente il prodotto
  deleteProduct() {
    this.delete.emit(this.product);
  }
}
