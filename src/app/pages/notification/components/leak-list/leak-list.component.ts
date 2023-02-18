import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Leak, LeakType } from "../../../analytics-page/models/rent";

@Component({
  selector: 'urb-leak-list',
  templateUrl: './leak-list.component.html',
  styleUrls: [ './leak-list.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeakListComponent implements OnChanges {
  public leakType = LeakType

  public leakTitleMap = {
    [ LeakType.negativeProfit ]: 'Мы ушли в минус',
    [ LeakType.tooHotTemp ]: 'Высокая температура',
    [ LeakType.tooMuchPowerConsuming ]: 'Высокое энергопотребление',
  }

  public leakDescriptionMap = {
    [ LeakType.negativeProfit ]: 'Сумма расходов перекрыла прибыль от аренды.',
    [ LeakType.tooHotTemp ]: 'Среднее значение температуры слишком высокое.',
    [ LeakType.tooMuchPowerConsuming ]: 'Среднее потребление электроэнергии слишком высокое.',
  }

  public currentLeaks: Leak[] = []

  @Input()
  public leaks: Leak[] | null = null

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue: Leak[] | null = changes[ 'leaks' ].currentValue

    if (currentValue !== null) {
      this.currentLeaks = currentValue.filter((leak) => this.leakTitleMap[ leak.alertType ])
    }
  }
}
