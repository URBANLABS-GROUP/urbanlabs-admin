import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsPageComponent } from "./analytics-page.component";
import { LeakListComponent } from "./components/leak-list/leak-list.component";
import { AnalyticsRoutingModule } from "./analytics-routing.module";
import { TuiAccordionModule } from "@taiga-ui/kit";
import { AnalyticsService } from "./services/analytics.service";
import { RentDebtComponent } from './components/rent-debt/rent-debt.component';
import { TuiPieChartModule } from "@taiga-ui/addon-charts";
import { TuiHintModule } from "@taiga-ui/core";
import { TuiMoneyModule } from "@taiga-ui/addon-commerce";
import { RentChartComponent } from './components/rent-chart/rent-chart.component';
import { HttpClientModule } from "@angular/common/http";


@NgModule({
  declarations: [
    AnalyticsPageComponent,
    LeakListComponent,
    RentDebtComponent,
    RentChartComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    TuiAccordionModule,
    TuiPieChartModule,
    TuiHintModule,
    TuiMoneyModule,
    HttpClientModule
  ],
  providers: [
    AnalyticsService
  ]
})
export class AnalyticsModule {
}
