import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Entry } from './entry';

const ENTRIES_URL: string = '/api/entries';

@Injectable()
export class EntryService {

  constructor(private http: HttpClient) { }

  getEntries(): Observable<Entry[]> {
    return this.http
               .get<Entry[]>(ENTRIES_URL)
               .pipe(
                 tap(entries => console.log('Got entries:', entries)),
                 catchError(this.handleError)
               );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error fetching entries.', error);
    return [];
  }
}
