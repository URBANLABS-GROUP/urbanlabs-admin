import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Rent } from "../../models/rent";

@Component({
  selector: 'urb-balance',
  templateUrl: './balance.component.html',
  styleUrls: [ './balance.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BalanceComponent implements OnChanges {
  public total = 0

  public startDate = ''

  @Input()
  public rents: Rent[] | null = null

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue: Rent[] | null = changes[ 'rents' ].currentValue

    if (currentValue !== null) {
      this.total = currentValue.reduce(
        (accumulator, currentValue) => accumulator + currentValue.realIncome - currentValue.powerExpenses - currentValue.checkExpenses, this.total
      )

      this.startDate = new Date(currentValue[ 0 ].date).toLocaleDateString()
    }
  }
}
