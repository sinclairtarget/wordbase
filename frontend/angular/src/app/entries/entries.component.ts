import { Component, OnInit } from '@angular/core';
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
  selectedEntry: Entry = null;

  constructor(private entryService: EntryService) { }

  ngOnInit(): void {
    this.getEntries();
  }

  getEntries(): void {
    this.entryService
        .getEntries()
        .subscribe(entries => this.entries = entries);
  }

  onEntrySelected(entry: Entry): void {
    this.selectedEntry = entry;
  }
}
