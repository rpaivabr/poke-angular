import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService, PokemonData } from 'src/app/services/api.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  myPokemons$!: Observable<PokemonData[]>

  constructor(private api: ApiService) { }

  ngOnInit(): void {
    this.myPokemons$ = this.api.listAllPokemons();
  }

  deletePokemon(id: number) {
    this.api.deletePokemon(id)
      .subscribe(() => this.myPokemons$ = this.api.listAllPokemons());
  }

}
