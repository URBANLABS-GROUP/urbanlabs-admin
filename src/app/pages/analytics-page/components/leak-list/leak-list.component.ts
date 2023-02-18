import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Leak, LeakType, Rent } from "../../models/rent";

@Component({
  selector: 'urb-leak-list',
  templateUrl: './leak-list.component.html',
  styleUrls: [ './leak-list.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeakListComponent implements OnChanges {
  public leakType = LeakType

  @Input()
  public leaks: Leak[] | null = [
    { alertType: LeakType.negativeProfit, roomId: 15, income: 5000, expense: 10020 },
    { alertType: LeakType.tooHotTemp, roomId: 9, currentTemp: 330, requiredTemp: 270 }
  ]

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue: Rent | null = changes[ 'leaks' ].currentValue

    if (currentValue !== null) {
    }
  }
}
