import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { of } from 'rxjs/observable/of';

import { Entry } from './entry';

@Injectable()
export class EntryService {
  private ENTRIES: Entry[] = [
    { word: 'Gregarious', definition: 'Very Sociable.' },
    { word: 'Newel', definition: 'The bottom post of a stair.' }
  ]

  constructor() { }

  getEntries(): Observable<Entry[]> {
    return of(this.ENTRIES);
  }
}
