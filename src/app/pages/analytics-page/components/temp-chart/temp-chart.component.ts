import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { TempChart } from "../../models/temp";
import { TuiPoint } from "@taiga-ui/core";
import { TuiContextWithImplicit, TuiStringHandler } from "@taiga-ui/cdk";

@Component({
  selector: 'urb-temp-chart',
  templateUrl: './temp-chart.component.html',
  styleUrls: [ './temp-chart.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TempChartComponent implements OnChanges {
  public height = 200

  public startY = 0

  public rooms: string[] = []

  @Input()
  public points: TempChart[] | null = null

  public values: TuiPoint[][] = []

  readonly hint: TuiStringHandler<TuiContextWithImplicit<readonly TuiPoint[]>> = ({ $implicit }) => {
    return `${ $implicit.map(([ _, y ]) => y / 10 + ' C').join('\n') }`;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue: TempChart[] | null = changes[ 'points' ].currentValue

    if (currentValue !== null) {
      this.values = currentValue.slice(0, 8).map((tempChart) => {
        this.rooms.push(tempChart.name)

        return tempChart.points.map((point) => {
          if (this.height < point.y) {
            this.height = point.y
          }

          if (this.startY === 0) {
            this.startY = point.y
          } else {
            if (this.startY > point.y) {
              this.startY = point.y
            }
          }

          return [ new Date(point.x).getDate(), point.y ];
        });
      })

      this.height = this.height - this.startY
      this.rooms = this.rooms.map((room) => {
        const words = room.split(' ')
        return words[ 1 ]
      })
    }
  }
}


