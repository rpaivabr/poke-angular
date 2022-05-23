import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PokemonData } from './api.service';

export interface PokeApiSearchData {
  count: number;
  next: string;
  previous: string;
  results: PokeApiResult[];
}

export interface PokeApiResult {
  name: string;
}

export interface PokeApiData {
  name: string;
  id: number;
  order: number;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    }
  }[];
  sprites: {
    other: {
      'official-artwork': {
        front_default: string;
      }
    }
  }
}

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {
  private pokeapiUrl = `${environment.pokeapiUrl}/pokemon`;

  constructor(private http: HttpClient) { }

  getPokemons(limit: number = 151): Observable<PokeApiResult[]> {
    return this.http.get<PokeApiSearchData>(`${this.pokeapiUrl}?limit=${limit}`).pipe(
      map((data: PokeApiSearchData): PokeApiResult[] => data.results),
    );
  }

  getPokemonByName(name: string): Observable<PokemonData> {
    return this.http.get<PokeApiData>(`${this.pokeapiUrl}/${name}`).pipe(
      map((data: PokeApiData): PokemonData => {
        const { sprites, types: apiTypes, id: order, name } = data;
        const imageUrl = sprites.other['official-artwork'].front_default;
        const types = apiTypes.map(t => t.type.name);

        return { imageUrl, types, order, name } as PokemonData;
      })
    );
  }
}
