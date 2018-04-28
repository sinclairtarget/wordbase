import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { map, tap, catchError, share } from 'rxjs/operators';
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
        tap(entries => console.log('Got entries:', entries)),
        catchError(this.handleEntriesError),
        share() // this is some next-level shit
      );
  }

  getEntry(location: string): Observable<Entry> {
    return this.http
      .get<Entry>(location)
      .pipe(
        map(e => new Entry(e)),
        tap(entry => console.log('Got entry: ', entry)),
        catchError(this.handleEntryError),
        share()
      );
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
