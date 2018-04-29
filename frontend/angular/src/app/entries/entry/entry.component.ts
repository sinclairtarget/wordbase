import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/observable';

import { Entry } from '../entry.model';
import { EntryService } from '../entry.service';

@Component({
  selector: 'entry',
  templateUrl: './entry.component.html',
  styleUrls: ['./entry.component.css']
})
export class EntryComponent implements OnInit {
  entry$: Observable<Entry> = null;

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(this.handleRouteChange);
  }

  private handleRouteChange = (params: ParamMap) => {
    let slug = params.get('slug');
    if (slug != null) {
      this.entry$ = this.entryService.getEntry(slug);
    }
  }
}
