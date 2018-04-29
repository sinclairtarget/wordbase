import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';

import {
  map,
  catchError,
  switchMap,
  share,
  filter
} from 'rxjs/operators';

import { of } from 'rxjs/observable/of';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Entry } from './entry.model';

const ENTRIES_URL: string = '/api/entries';

@Injectable()
export class EntryService {
  constructor(private http: HttpClient) { }

  getEntries(): Observable<Entry[]> {
    return this.http
      .get<Entry[]>(ENTRIES_URL)
      .pipe(
        map(entries => entries.map(e => new Entry(e))),
        catchError(this.handleEntriesError),
        share()
      );
  }

  getEntry(slug: string): Observable<Entry> {
    // Get entries, find right entry, then request latest data for that entry.
    let entries$ = this.getEntries();
    return entries$.pipe(
      map(entries => this.findEntry(slug, entries)),
      filter(entry => entry != null),
      switchMap(this._getEntry),
      share()
    );
  }

  private _getEntry = (entry: Entry): Observable<Entry> => {
    return this.http
      .get<Entry>(entry.location)
      .pipe(
        map(e => new Entry(e)), // So we can call methods
        catchError(this.handleEntryError)
      );
  };

  private findEntry(slug: string, entries: Entry[]): Entry {
    let entry = entries.find(e => e.slug == slug);
    if (entry == null)
      console.error(`Entry with slug "${slug}" not found.`);

    return entry;
  }

  private handleEntriesError = (error: HttpErrorResponse) => {
    console.error('Error fetching entries.', error);
    return of([]);
  }

  private handleEntryError = (error: HttpErrorResponse) => {
    console.error('Error fetching entry: ', error);
    return of(null);
  }
}
