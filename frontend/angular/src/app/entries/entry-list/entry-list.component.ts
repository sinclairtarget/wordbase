import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Entry } from '../entry.model';

@Component({
  selector: 'entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent {
  @Input() entries: Entry[];
  @Output() onEntryClicked: EventEmitter<Entry>;

  constructor() {
    this.onEntryClicked = new EventEmitter();
  }

  clicked(entry: Entry): boolean {
    this.onEntryClicked.emit(entry);
    return false;
  }
}
