import { Component } from '@angular/core';

@Component({
  selector: 'app-list-component',
  templateUrl: './list.component.html'
})
export class ListComponent {
  public currentCount = 0;

  public incrementCounter() {
    this.currentCount++;
  }
}
