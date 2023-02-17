import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

@Component({
  selector: 'urb-rent-debt',
  templateUrl: './rent-debt.component.html',
  styleUrls: ['./rent-debt.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RentDebtComponent {
  @Input()
  public debt = null

  readonly value = [13769, 12367];
  readonly labels = ['Оплатили', 'Не оплатили'];
}

