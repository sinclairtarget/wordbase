import {
  Component,
  Input,
  Output,
  EventEmitter
} from '@angular/core';

import { Entry } from '../entry.model';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() entries: Entry[];
  @Output() onEntrySelected: EventEmitter<Entry>;

  constructor() {
    this.onEntrySelected = new EventEmitter();
  }

  onEntryClicked(entry: Entry): void {
    this.onEntrySelected.emit(entry);
  }
}
