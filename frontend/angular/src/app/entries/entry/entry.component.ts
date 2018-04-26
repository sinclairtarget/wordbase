import {
  Component,
  Input,
  OnChanges
} from '@angular/core';
import { Entry } from '../entry.model';

@Component({
  selector: 'entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnChanges {
  @Input() entry: Entry;

  constructor() { }

  ngOnChanges() {
    console.log("Entry changed!");
  }
}
