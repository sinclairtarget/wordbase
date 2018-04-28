import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { EntryService } from './entry.service';
import { EntriesComponent } from './entries.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EntryListComponent } from './entry-list/entry-list.component';
import { EntryComponent } from './entry/entry.component';

const routes: Routes = [
  {
    path: 'entries',
    component: EntriesComponent,
    children: [
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
    EntryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    EntriesComponent
  ],
  providers: [EntryService]
})
export class EntriesModule { }
