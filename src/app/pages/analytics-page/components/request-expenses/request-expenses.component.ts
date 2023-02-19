import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Rent } from "../../models/rent";

@Component({
  selector: 'urb-request-expenses',
  templateUrl: './request-expenses.component.html',
  styleUrls: [ './request-expenses.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RequestExpensesComponent implements OnChanges {
  public total = 0

  public startDate = ''

  @Input()
  public expenses: Rent[] | null = null

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue: Rent[] | null = changes[ 'expenses' ].currentValue

    if (currentValue !== null) {
      this.total = currentValue.reduce(
        (accumulator, currentValue) => accumulator - currentValue.requestExpenses, this.total
      )

      this.startDate = new Date(currentValue[ 0 ].date).toLocaleDateString()
    }
  }
}
