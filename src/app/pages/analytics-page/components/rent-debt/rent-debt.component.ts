import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {EMPTY, Observable} from "rxjs";

@Component({
  selector: 'urb-rent-debt',
  templateUrl: './rent-debt.component.html',
  styleUrls: ['./rent-debt.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RentDebtComponent {
  @Input()
  public debt: Observable<any> = EMPTY
}
