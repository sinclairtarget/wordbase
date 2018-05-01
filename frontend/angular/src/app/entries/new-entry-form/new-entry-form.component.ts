import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/observable';

import { Entry } from '../entry.model';
import { EntryService } from '../entry.service';

@Component({
  selector: 'new-entry-form',
  templateUrl: './new-entry-form.component.html',
  styleUrls: ['./new-entry-form.component.css']
})
export class NewEntryFormComponent {
  entry: Entry = new Entry({});

  constructor(
    private entryService: EntryService,
    private router: Router
  ) { }

  get diagnostic(): string {
    return JSON.stringify(this.entry);
  }

  onSubmit() {
    console.log(this.diagnostic);
    this.entryService.addEntry(this.entry)
      .subscribe(e => {
        this.entryService.clear();
        this.router.navigate(['/entries', e.slug]);
      });
  }
}
