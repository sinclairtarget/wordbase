import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { EntryService } from './entry.service';
import { EntriesComponent } from './entries.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EntryListComponent } from './entry-list/entry-list.component';
import { EntryComponent } from './entry/entry.component';
import {
  NewEntryFormComponent
} from './new-entry-form/new-entry-form.component';

const routes: Routes = [
  {
    path: 'entries',
    component: EntriesComponent,
    children: [
      { path: 'new', component: NewEntryFormComponent },
      { path: ':slug', component: EntryComponent },
      { path: '', component: EntryComponent }
    ]
  }
];

@NgModule({
  declarations: [
    EntriesComponent,
    SidebarComponent,
    EntryListComponent,
    EntryComponent,
    NewEntryFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  exports: [
    EntriesComponent
  ],
  providers: [EntryService]
})
export class EntriesModule { }
