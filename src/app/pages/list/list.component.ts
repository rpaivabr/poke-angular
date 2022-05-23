import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService, PokemonData } from 'src/app/services/api.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  myPokemons$!: Observable<PokemonData[]>;

  constructor(
    private router: Router,
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.myPokemons$ = this.api.listAllPokemons();
  }

  deletePokemon(id: number): void {
    this.api.deletePokemon(id).subscribe({
      next: () => {
        this.snackBar.open('Pokémon removed');
        this.myPokemons$ = this.api.listAllPokemons();
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Error, try again later');
      },
    });
  }

  navigateTo(id: number): void {
    this.router.navigateByUrl(`/detail/${id}`);
  }
}
