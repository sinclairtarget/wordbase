import { Component } from '@angular/core';
import { Entry } from './entry';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  entries: Entry[] = [
    { word: 'Gregarious', definition: 'Very Sociable.' },
    { word: 'Newel', definition: 'The bottom post of a stair.' }
  ]

  title = 'app';
}
