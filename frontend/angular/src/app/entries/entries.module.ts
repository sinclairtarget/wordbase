import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { EntryService } from './entry.service';
import { EntriesComponent } from './entries.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EntryListComponent } from './entry-list/entry-list.component';
import { EntryComponent } from './entry/entry.component';

@NgModule({
  declarations: [
    EntriesComponent,
    SidebarComponent,
    EntryListComponent,
    EntryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule
  ],
  exports: [
    EntriesComponent
  ],
  providers: [EntryService]
})
export class EntriesModule { }
