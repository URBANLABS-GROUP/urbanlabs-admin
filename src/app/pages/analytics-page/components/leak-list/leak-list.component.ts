import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {EMPTY, Observable} from "rxjs";

@Component({
  selector: 'urb-leak-list',
  templateUrl: './leak-list.component.html',
  styleUrls: ['./leak-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeakListComponent {
  @Input()
  public leaks: Observable<any> = EMPTY
}
