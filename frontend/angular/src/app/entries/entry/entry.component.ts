import { Component, Input } from '@angular/core';
import { Entry } from '../entry.model';

@Component({
  selector: 'entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent {
  @Input() entry: Entry;

  constructor() { }
}
