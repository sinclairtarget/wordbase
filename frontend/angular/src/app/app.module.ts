import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EntryComponent } from './entry/entry.component';
import { EntryService } from './entry.service';

const routes: Routes = [
  { path: '', redirectTo: '/entries', pathMatch: 'full' },
  { path: 'entries', component: AppComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    EntryComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [EntryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
