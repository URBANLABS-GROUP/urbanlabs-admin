import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Rent } from "../../models/rent";

@Component({
  selector: 'urb-rent-income',
  templateUrl: './rent-income.component.html',
  styleUrls: [ './rent-income.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RentIncomeComponent implements OnChanges {
  public total = 0

  public startDate = ''

  public isLoading = true

  @Input()
  public income: Rent[] | null = null

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue: Rent[] | null = changes[ 'income' ].currentValue

    if (currentValue !== null) {
      this.total = currentValue.reduce(
        (accumulator, currentValue) => accumulator + currentValue.realIncome, this.total
      )

      this.startDate = new Date(currentValue[ 0 ].date).toLocaleDateString()

      this.isLoading = false
    }
  }
}
