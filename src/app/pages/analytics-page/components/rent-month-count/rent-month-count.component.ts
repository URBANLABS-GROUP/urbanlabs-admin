import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Rent } from "../../models/rent";

@Component({
  selector: 'urb-rent-month-count',
  templateUrl: './rent-month-count.component.html',
  styleUrls: [ './rent-month-count.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RentMonthCountComponent {
  @Input()
  public rent: Rent | null = null

  readonly value = [ 13769, 12367 ]
  readonly labels = [ 'Арендовано', 'Сдается' ]
}
