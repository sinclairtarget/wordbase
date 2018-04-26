import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { map, tap, catchError, share } from 'rxjs/operators';
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
                 map(entries =>
                   entries.map(e => new Entry(e.word, e.definition))
                 ),
                 tap(entries => console.log('Got entries:', entries)),
                 catchError(this.handleError)
                 share() // this is some next-level shit
               );
  }

  getEntry(location: string): Observable<Entry> {
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error fetching entries.', error);
    return [];
  }
}
