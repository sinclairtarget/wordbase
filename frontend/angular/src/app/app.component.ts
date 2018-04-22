import { Component, OnInit } from '@angular/core';
import { Entry } from './entry';
import { EntryService } from './entry.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
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
}
