import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AnalyticsService } from "../../../analytics-page/services/analytics.service";
import { map } from "rxjs";

@Component({
  selector: 'urb-notification',
  templateUrl: './notification.component.html',
  styleUrls: [ './notification.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NotificationComponent {
  public leaks

  constructor(private analyticsService: AnalyticsService) {
    this.leaks = this.analyticsService.loadMonthRent(3, '2023-01-01T00:00:00Z', '2023-02-01T00:00:00Z').pipe(
      map((rent) => rent.alerts)
    )
  }
}
