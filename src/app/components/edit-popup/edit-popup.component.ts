import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RatingModule } from 'primeng/rating';

import { Product } from '../../../types';

@Component({
  selector: 'app-edit-popup',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    RatingModule,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-popup.component.html',
  styleUrl: './edit-popup.component.scss',
})
export class EditPopupComponent implements OnChanges {
  constructor(private formBuilder: FormBuilder) {}

  // Input e Output per gestire la visibilità del popup e l'header della modale
  @Input() display: boolean = false;
  @Output() displayChange = new EventEmitter<boolean>();
  @Input() header!: string;

  // Input per ricevere il prodotto da modificare e Output per confermare la modifica
  @Input() product: Product = {
    name: '',
    image: '',
    price: '',
    rating: 0,
  };
  @Output() confirm = new EventEmitter<Product>();

  // Form per gestire i campi del prodotto nel popup e validators
  productForm = this.formBuilder.group({
    name: ['', [Validators.required]],
    image: ['', [Validators.required]],
    price: ['', [Validators.required, Validators.min(0.01)]],
    rating: [0, [Validators.required]],
  });

  // Metodo richiamato quando ci sono cambiamenti nei dati di input
  ngOnChanges() {
    this.productForm.patchValue(this.product);
  }

  // Metodo per confermare la modifica del prodotto e chiudere il popup
  onConfirm() {
    const { name, image, price, rating } = this.productForm.value;

    // Emette l'evento di conferma con i nuovi dati del prodotto
    // Utilizza il valore inserito nel campo, se vuoto, usa stringa vuota
    this.confirm.emit({
      name: name || '',
      image: image || '',
      price: price || '',
      rating: rating || 0,
    });

    // Nasconde il popup dopo la conferma
    this.display = false;
    this.displayChange.emit(this.display);
  }

  // Metodo per annullare la modifica e chiudere il popup
  onCancel() {
    this.displayChange.emit(false);
  }
}
