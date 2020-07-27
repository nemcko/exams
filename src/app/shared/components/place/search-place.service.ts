
import {map, debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs';





@Injectable({
  providedIn: 'root'
})
export class SearchPlaceService {
  constructor(private http: Http) { }

  search(terms: Observable<string>) {
    return terms.pipe(debounceTime(400),
      distinctUntilChanged(),
      switchMap(term => this.searchEntries(term)),);
  }

  searchEntries(term) {
    return this.http
        .get(`https://nominatim.openstreetmap.org/search?q=${term}&format=json`).pipe(
        map(res => res.json()));
  }
}