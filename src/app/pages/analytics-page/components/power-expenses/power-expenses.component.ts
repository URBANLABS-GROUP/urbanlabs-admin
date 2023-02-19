import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Rent } from "../../models/rent";

@Component({
  selector: 'urb-power-expenses',
  templateUrl: './power-expenses.component.html',
  styleUrls: [ './power-expenses.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PowerExpensesComponent implements OnChanges {
  public total = 0

  public startDate = ''

  public isLoading = true

  @Input()
  public expenses: Rent[] | null = null

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue: Rent[] | null = changes[ 'expenses' ].currentValue

    if (currentValue !== null) {
      this.total = currentValue.reduce(
        (accumulator, currentValue) => accumulator - currentValue.powerExpenses, this.total
      )

      this.startDate = new Date(currentValue[ 0 ].date).toLocaleDateString()

      this.isLoading = false
    }
  }
}
