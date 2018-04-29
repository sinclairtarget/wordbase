import { Component, OnInit } from '@angular/core';

import { Entry } from '../entry.model';

@Component({
  selector: 'new-entry-form',
  templateUrl: './new-entry-form.component.html',
  styleUrls: ['./new-entry-form.component.css']
})
export class NewEntryFormComponent implements OnInit {
  ngOnInit() {
    console.log('New entry form init!');
  }
}
