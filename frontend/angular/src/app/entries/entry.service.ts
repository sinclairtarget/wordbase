import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { ConnectableObservable } from 'rxjs/observable/connectableobservable';

import {
  map,
  catchError,
  switchMap,
  publishLast,
  filter,
  share
} from 'rxjs/operators';

import { of } from 'rxjs/observable/of';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http';

import { Entry } from './entry.model';

const ENTRIES_URL: string = '/api/entries';
const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json'
  })
};

@Injectable()
export class EntryService {
  // We only want to make this call once.
  private entries$: ConnectableObservable<Entry[]> = null;

  constructor(private http: HttpClient) { }

  getEntries(): Observable<Entry[]> {
    if (this.entries$ === null) {
      this.entries$ = this._getEntries();
      // Fire the http request.
      // Author of RXJS says this is an anti-pattern, calling connect() should
      // be the caller's responsibility. But not sure how that would work
      // since we are trying to cache the result here.
      //
      // Maybe each caller would have to call connect itself? But that seems
      // strange. Connect() would be called multiple times.
      this.entries$.connect();
    }

    return this.entries$;
  }

  getEntry(slug: string): Observable<Entry> {
    // Get entries, find right entry, then request latest data for that entry.
    return this.getEntries().pipe(
      map(entries => this.findEntry(slug, entries)),
      filter(entry => entry != null),
      switchMap(this._getEntry),
      // Similar to "publishLast()" in that the stream becomes multicast. But
      // instead of becoming a ConnectableObservable, the observable
      // automatically gets connected any time the subscriber count goes from 0
      // to 1.
      share()
    );
  }

  addEntry(entry: Entry): Observable<Entry> {
    return this.http.post<Entry>(ENTRIES_URL, entry, HTTP_OPTIONS)
      .pipe(
        map(e => new Entry(e)),
        catchError(this.handleAddError)
      );
  }

  clear() {
    this.entries$ = null;
  }

  private _getEntries(): ConnectableObservable<Entry[]> {
    return this.http
      .get<Entry[]>(ENTRIES_URL)
      .pipe(
        map(entries => entries.map(e => new Entry(e))),
        catchError(this.handleEntriesError),
        // "publish", so that the stream is multicast.
        // "last", so that subscribers get the last emitted value, even after
        // the stream completes.
        // Must call "connect()" to begin stream.
        publishLast()
      ) as ConnectableObservable<Entry[]>; // :(
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

  private handleAddError = (error: HttpErrorResponse) => {
    console.error('Error POST-ing entry: ', error);
    return of(null);
  }
}
