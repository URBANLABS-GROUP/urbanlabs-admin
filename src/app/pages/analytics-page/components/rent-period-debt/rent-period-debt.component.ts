import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Rent } from "../../models/rent";
import { TuiContextWithImplicit } from "@taiga-ui/cdk";
import { tuiFormatNumber } from "@taiga-ui/core";
import { monthMap } from '../../common/month-map';

@Component({
  selector: 'urb-rent-period-debt',
  templateUrl: './rent-period-debt.component.html',
  styleUrls: [ '../styles.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RentPeriodDebtComponent implements OnChanges {
  private monthMap: Record<number, string> = monthMap

  @Input()
  public rents: Rent[] | null = null

  public max = 1

  public value: number[][] = []

  public labelsX: string[] = []
  public labelsY: string[] = []

  readonly hint = ({ $implicit }: TuiContextWithImplicit<number>): string =>
    this.value
      .reduce((result, set) => `${ result }${ tuiFormatNumber(set[ $implicit ]) } ₽\n`, '')
      .trim();

  setChartData(rents: Rent[]) {
    let maxY = 0
    const period: string[] = []
    const values: number[][] = [
      [], []
    ]

    rents.forEach((rent) => {
      values[ 0 ].push(rent.realIncome)
      values[ 1 ].push(rent.expectedIncome - rent.realIncome)

      if (rent.expectedIncome > maxY) {
        maxY = rent.expectedIncome
      }

      const currentDate = new Date(rent.date)
      period.push(period.length === 0 ? `${ this.monthMap[ currentDate.getMonth() ].slice(0, 3) } ${ currentDate.getFullYear() }` : this.monthMap[ currentDate.getMonth() ].slice(0, 3))
    })

    this.labelsX = period
    this.max = maxY
    this.labelsY = [ '0', maxY.toString().slice(0, 3) + 'К ₽' ]
    this.value = values
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue: Rent[] | null = changes[ 'rents' ].currentValue

    if (currentValue !== null) {
      this.setChartData(currentValue)
    }
  }
}
