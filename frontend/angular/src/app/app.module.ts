import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EntriesModule } from './entries/entries.module'

import { AppComponent } from './app.component';
import { EntriesComponent } from './entries/entries.component';

const routes: Routes = [
  { path: '', redirectTo: '/entries', pathMatch: 'full' },
  { path: 'entries', component: EntriesComponent },
  { path: 'entries/:slug', component: EntriesComponent }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    EntriesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
