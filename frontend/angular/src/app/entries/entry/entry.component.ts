import { Component } from '@angular/core';

import { Entry } from '../entry.model';
import { EntryService } from '../entry.service';

@Component({
  selector: 'entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent {
  entry: Entry = null;

  constructor(
    private entryService: EntryService
  ) { }
}
