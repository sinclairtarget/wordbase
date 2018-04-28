import {
  Component,
  Input
} from '@angular/core';

import { Entry } from '../entry.model';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  @Input() entries: Entry[];
}
