import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TuiPoint } from "@taiga-ui/core";
import { TuiContextWithImplicit, TuiStringHandler } from "@taiga-ui/cdk";
import { PowerChart } from "../../models/power";

@Component({
  selector: 'urb-power-chart',
  templateUrl: './power-chart.component.html',
  styleUrls: [ './power-chart.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PowerChartComponent implements OnChanges {
  public height = 70

  public startY = 0

  public rooms: string[] = []

  public isLoading = true

  @Input()
  public points: PowerChart[] | null = null

  public values: TuiPoint[][] = []

  readonly hint: TuiStringHandler<TuiContextWithImplicit<readonly TuiPoint[]>> = ({ $implicit }) => {
    return `${ $implicit.map(([ _, y ]) => y + ' Вт').join('\n') }`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue: PowerChart[] | null = changes[ 'points' ].currentValue

    if (currentValue !== null) {
      this.values = currentValue.slice(2, 4).map((powerChart) => {
        this.rooms.push(powerChart.name)

        return powerChart.points.map((point) => {
          return [ new Date(point.x).getDate(), Math.floor(point.y / 10) ];
        });
      })

      this.height = this.height - this.startY
      this.rooms = this.rooms.map((room) => {
        const words = room.split(' ')
        return words[ 1 ]
      })

      this.isLoading = false
    }
  }
}
