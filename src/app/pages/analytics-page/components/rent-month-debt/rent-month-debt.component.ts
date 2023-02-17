import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Rent } from "../../models/rent";

@Component({
  selector: 'urb-rent-month-debt',
  templateUrl: './rent-month-debt.component.html',
  styleUrls: [ './rent-month-debt.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RentMonthDebtComponent implements OnChanges {
  @Input()
  public debt: Rent | null = null

  readonly labels = [ 'Оплатили', 'Не оплатили' ]
  public value: number[] = []

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue: Rent | null = changes[ 'debt' ].currentValue

    if (currentValue !== null) {
      this.value = [ currentValue.realIncome, currentValue.expectedIncome - currentValue.realIncome ]
    }
  }
}

