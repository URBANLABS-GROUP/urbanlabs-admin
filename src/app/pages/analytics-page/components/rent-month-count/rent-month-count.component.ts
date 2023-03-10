import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Rent } from "../../models/rent";

@Component({
  selector: 'urb-rent-month-count',
  templateUrl: './rent-month-count.component.html',
  styleUrls: [ '../styles.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RentMonthCountComponent implements OnChanges {
  @Input()
  public rent: Rent | null = null

  readonly labels = [ 'Арендовано', 'Свободно' ]
  public value: number[] = []
  public isLoading = true

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue: Rent | null = changes[ 'rent' ].currentValue

    if (currentValue !== null) {
      this.value = [ currentValue.rentCount, currentValue.roomCount - currentValue.rentCount ]

      this.isLoading = false
    }
  }
}
