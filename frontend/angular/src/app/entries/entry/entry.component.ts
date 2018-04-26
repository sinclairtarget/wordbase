import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { Observable } from 'rxjs/observable';

import { Entry } from '../entry.model';
import { EntryService } from '../entry.service';

@Component({
  selector: 'entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnChanges {
  @Input() entry: Entry;

  // This entry, fetched directly from the API, could hypothetically contain
  // more information then the one received via @Input.
  entry$: Observable<Entry>;

  constructor(
    private entryService: EntryService
  ) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('entry') && this.entry != null)
      this.entry$ = this.entryService.getEntry(this.entry.location);
  }
}
