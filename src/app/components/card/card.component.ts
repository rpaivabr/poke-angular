import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PokemonData } from '../../services/api.service';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent {

  @Input() pokemon!: PokemonData
  @Input() actions = false;
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  deletePokemon(id: number) {
    this.delete.emit(id);
  }

  editPokemon(id: number) {
    this.edit.emit(id);
  }

}
