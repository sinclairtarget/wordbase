import { Component, Input } from '@angular/core';
import { Entry } from '../entry.model';

@Component({
  selector: 'entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent {
  @Input() entries: Entry[];

  constructor() { }
}
