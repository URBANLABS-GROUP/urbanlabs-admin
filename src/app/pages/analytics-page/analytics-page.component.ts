import { ChangeDetectionStrategy, Component } from "@angular/core"
import { AnalyticsService } from "./services/analytics.service";
import { map } from "rxjs";

@Component({
  selector: 'urb-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: [ './analytics-page.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsPageComponent {
  public leaks
  public rent
  public rents
  public points

  constructor(private analyticsService: AnalyticsService) {
    this.leaks = this.analyticsService.loadMonthRent(3, '2023-01-01T00:00:00Z', '2023-02-01T00:00:00Z').pipe(
      map((rent) => rent.alerts)
    )
    this.rent = this.analyticsService.loadMonthRent(3, '2023-02-01T00:00:00Z', '2023-03-01T00:00:00Z')
    this.rents = this.analyticsService.loadPeriodRents(3, '2023-01-01T00:00:00Z', '2023-03-01T00:00:00Z')
    this.points = this.analyticsService.loadTempChart(3, '2023-01-01T00:00:00Z', '2023-02-01T00:00:00Z')
  }
}
