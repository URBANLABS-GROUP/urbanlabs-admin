import { ChangeDetectionStrategy, Component } from "@angular/core"
import { AnalyticsService } from "./services/analytics.service";

@Component({
  selector: 'urb-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: [ './analytics-page.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsPageComponent {
  public rent
  public rents
  public tempPoints
  public powerPoints

  constructor(private analyticsService: AnalyticsService) {

    this.rent = this.analyticsService.loadMonthRent(3, '2023-02-01T00:00:00Z', '2023-03-01T00:00:00Z')
    this.rents = this.analyticsService.loadPeriodRents(3, '2022-06-01T00:00:00Z', '2023-03-01T00:00:00Z')
    this.tempPoints = this.analyticsService.loadTempChart(3, '2023-01-01T00:00:00Z', '2023-02-01T00:00:00Z')
    this.powerPoints = this.analyticsService.loadPowerChart(3, '2023-01-01T00:00:00Z', '2023-02-01T00:00:00Z')
  }
}
