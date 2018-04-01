import { Component, Input, OnInit } from '@angular/core';
import { Entry } from '../entry';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @Input() entries: Entry[];

  constructor() { }

  ngOnInit() { }
}
