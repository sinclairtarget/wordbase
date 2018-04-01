import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { EntryService } from './entry.service';


@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [EntryService],
  bootstrap: [AppComponent]
})
export class AppModule { }
