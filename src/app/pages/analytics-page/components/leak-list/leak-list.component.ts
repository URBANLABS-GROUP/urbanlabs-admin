import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'urb-leak-list',
  templateUrl: './leak-list.component.html',
  styleUrls: ['./leak-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeakListComponent {

}
