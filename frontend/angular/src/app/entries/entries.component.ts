import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/observable';
import { combineLatest } from 'rxjs/operators';

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

  private entries$: Observable<Entry[]>;

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute
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

    this.route.paramMap
      .pipe(combineLatest(this.entries$))
      .subscribe(this.handleRouteChange.bind(this)); // fucking javascript
  }

  private handleRouteChange([params: ParamMap, entries: Entry[]]) {
    let slug = params.get('slug');
    console.log(this);
    if (slug != null)
      this.updateSelectedEntry(slug, this.entries);
  }

  private updateSelectedEntry(slug: string, entries: Entry[]): void {
    this.selectedEntry = entries.find(e => e.slug == slug);
  }
}
