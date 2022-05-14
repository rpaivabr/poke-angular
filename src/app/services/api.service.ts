import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface PokemonData {
  id?: number;
  name: string;
  order: number;
  imageUrl: string;
  types: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = `${environment.apiUrl}/pokemons`;

  constructor(private http: HttpClient) { }

  listAllPokemons(): Observable<PokemonData[]> {
    return this.http.get<PokemonData[]>(this.apiUrl)
  }

  getPokemonById(id: number): Observable<PokemonData> {
    return this.http.get<PokemonData>(`${this.apiUrl}/${id}`);
  }

  createPokemon(pokemon: PokemonData): Observable<PokemonData> {
    return this.http.post<PokemonData>(this.apiUrl, pokemon);
  }

  updatePokemon(pokemon: PokemonData): Observable<PokemonData> {
    return this.http.put<PokemonData>(`${this.apiUrl}/${pokemon.id}`, pokemon);
  }

  deletePokemon(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
