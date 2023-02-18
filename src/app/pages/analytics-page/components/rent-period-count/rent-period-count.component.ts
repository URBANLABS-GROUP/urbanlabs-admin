import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TuiContextWithImplicit } from "@taiga-ui/cdk";
import { tuiFormatNumber } from "@taiga-ui/core";
import { Rent } from "../../models/rent";

@Component({
  selector: 'urb-rent-period-count',
  templateUrl: './rent-period-count.component.html',
  styleUrls: [ './rent-period-count.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RentPeriodCountComponent implements OnChanges {
  private monthMap: Record<number, string> = {
    0: 'Янв',
    1: 'Фев',
    2: 'Мар',
    3: 'Апр',
    4: 'Май',
    5: 'Июн',
    6: 'Июл',
    7: 'Авг',
    8: 'Сен',
    9: 'Окт',
    10: 'Ноя',
    11: 'Дек',
  }

  @Input()
  public rents: Rent[] | null = null

  public max = 1

  public value = [
    [ 0 ],
    [ 0 ],
  ];

  public labelsX: string[] = [];
  public labelsY: string[] = [];

  public appearance = 'onDark';

  readonly hint = ({ $implicit }: TuiContextWithImplicit<number>): string =>
    this.value
      .reduce((result, set) => `${ result }${ tuiFormatNumber(set[ $implicit ]) }\n`, '')
      .trim();

  setChartData(rents: Rent[]) {
    let maxY = 0
    const period: string[] = []
    const values: number[][] = [
      [], []
    ]

    rents.forEach((rent) => {
      values[ 0 ].push(rent.rentCount)
      values[ 1 ].push(rent.roomCount - rent.rentCount)

      if (rent.roomCount > maxY) {
        maxY = rent.roomCount
      }

      const currentDate = new Date(rent.date)
      period.push(period.length === 0 ? `${ this.monthMap[ currentDate.getMonth() ] } ${ currentDate.getFullYear() }` : this.monthMap[ currentDate.getMonth() ])
    })

    this.labelsX = period
    this.max = maxY
    this.labelsY = [ '0', maxY.toString() ]
    this.value = values
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue: Rent[] | null = changes[ 'rents' ].currentValue

    if (currentValue !== null) {
      this.setChartData(currentValue)
      console.log(currentValue)
    }
  }
}
