import { ChangeDetectionStrategy, Component } from "@angular/core"
import {AnalyticsService} from "./services/analytics.service";

@Component({
  selector: 'urb-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnalyticsPageComponent {
  constructor(private analyticsService: AnalyticsService) {
  }

  public leaks = this.analyticsService.loadLeaks()
  public debt = this.analyticsService.loadRentDebt()
}
