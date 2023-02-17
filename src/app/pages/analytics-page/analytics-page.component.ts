import { ChangeDetectionStrategy, Component } from "@angular/core"
import { AnalyticsService } from "./services/analytics.service";

@Component({
  selector: 'urb-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: [ './analytics-page.component.css' ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsPageComponent {
  public leaks
  public rent

  constructor(private analyticsService: AnalyticsService) {
    this.leaks = this.analyticsService.loadLeaks()
    this.rent = this.analyticsService.loadMonthRent(1, '2023-02-01T00:00:00Z', '2023-03-01T00:00:00Z')
  }
}
