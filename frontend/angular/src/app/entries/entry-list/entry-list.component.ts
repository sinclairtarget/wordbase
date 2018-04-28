import {
  Component,
  OnInit
} from '@angular/core';

import { Observable } from 'rxjs/observable';

import { Entry } from '../entry.model';
import { EntryService } from '../entry.service';

@Component({
  selector: 'entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {
  entries$: Observable<Entry[]>;

  constructor(private entryService: EntryService) { }

  ngOnInit(): void {
    this.entries$ = this.entryService.getEntries();
  }
}
