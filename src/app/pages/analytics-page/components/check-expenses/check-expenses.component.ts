import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Rent } from "../../models/rent";

@Component({
  selector: 'urb-check-expenses',
  templateUrl: './check-expenses.component.html',
  styleUrls: [ './check-expenses.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckExpensesComponent implements OnChanges {
  public total = 0
  public startDate = ''
  public isLoading = true

  @Input()
  public expenses: Rent[] | null = null

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue: Rent[] | null = changes[ 'expenses' ].currentValue

    if (currentValue !== null) {
      this.total = currentValue.reduce(
        (accumulator, currentValue) => accumulator - currentValue.checkExpenses, this.total
      )

      this.startDate = new Date(currentValue[ 0 ].date).toLocaleDateString()

      this.isLoading = false
    }
  }
}
