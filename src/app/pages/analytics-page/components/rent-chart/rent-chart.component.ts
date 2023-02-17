import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'urb-rent-chart',
  templateUrl: './rent-chart.component.html',
  styleUrls: ['./rent-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RentChartComponent {
  @Input()
  public rent: any = null

  readonly value = [13769, 12367]
  readonly labels = ['Арендовано', 'Сдается']
}
