import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/observable';

import { Entry } from './entry.model';
import { EntryService } from './entry.service';

// Root component for all entry-related pages.
@Component({
  selector: 'entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.css']
})
export class EntriesComponent implements OnInit {
  entries: Entry[];

  private entries$: Observable<Entry[]>;

  constructor(
    private entryService: EntryService,
  ) { }

  ngOnInit(): void {
    // fetch entries
    //
    // on route change
    // wait for entries
    // update currently selected
    this.entries$ = this.entryService.getEntries();
    this.entries$.subscribe(entries => {
      this.entries = entries;
    });
  }
}
