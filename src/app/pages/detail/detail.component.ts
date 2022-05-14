import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService, PokemonData } from 'src/app/services/api.service';
import { PokeApiResult, PokeapiService } from 'src/app/services/pokeapi.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  pokemonList!: PokeApiResult[]
  pokemonSelected!: PokemonData;
  pokemonControl!: FormControl;
  idToEdit!: number | null;
  notAllowedTypes: string[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private api: ApiService,
    private pokeApi: PokeapiService,
  ) {}

  ngOnInit(): void {
    this.idToEdit = null;
    this.pokemonControl = this.fb.control('');

    this.pokemonControl.valueChanges.subscribe(name => {
      this.selectPokemon(name);
    });

    this.pokeApi.getPokemons()
      .subscribe(results => this.pokemonList = results);

    this.api.listAllPokemons().subscribe(myPokemons => {
      myPokemons.forEach(pokemon =>
        this.notAllowedTypes = [...this.notAllowedTypes, ...pokemon.types]
      )
      console.log(this.notAllowedTypes);
    })

    this.route.params.subscribe(params => {
      this.getPokemonToEdit(params['id']);
    });
  }

  get isAllowedType(): boolean {
    if (!this.pokemonSelected) return true;

    if (!this.notAllowedTypes.length) return true;

    let result = true;

    this.pokemonSelected.types.forEach(type => {
      if (this.notAllowedTypes.includes(type)) {
        result = false;
      }
    })

    return result;
  }

  save(): void {
    const savePokemon = this.idToEdit && this.idToEdit !== 0
      ? this.api.updatePokemon({ id: this.idToEdit, ...this.pokemonSelected })
      : this.api.createPokemon(this.pokemonSelected);

    savePokemon
      .subscribe(() => this.router.navigate(['list']));
  }

  remove(): void {
    this.api.deletePokemon(this.idToEdit!)
      .subscribe(() => this.router.navigate(['list']));
  }

  private selectPokemon(name: string): void {
    this.pokeApi.getPokemonByName(name)
      .subscribe(pokemon => this.pokemonSelected = pokemon);
  }

  private getPokemonToEdit(paramId: string): void {
    if (paramId === 'select') return;

    const id = Number(paramId);
    if (isNaN(id)) this.redirectToNotFound();

    this.api.getPokemonById(id).subscribe({
      next: data => {
        this.pokemonControl.setValue(data.name),
        this.pokemonSelected = data;
        this.idToEdit = id;
      },
      error: err => {
        console.error(err);
        this.redirectToNotFound();
      }
    });
  }

  private redirectToNotFound(): void {
    this.router.navigate(['404'])
  }

}
