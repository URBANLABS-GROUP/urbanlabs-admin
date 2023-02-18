import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalyticsPageComponent } from "./analytics-page.component";
import { LeakListComponent } from "./components/leak-list/leak-list.component";
import { AnalyticsRoutingModule } from "./analytics-routing.module";
import { TuiAccordionModule, TuiIslandModule, TuiMarkerIconModule } from "@taiga-ui/kit";
import { AnalyticsService } from "./services/analytics.service";
import { RentMonthDebtComponent } from './components/rent-month-debt/rent-month-debt.component';
import { TuiAxesModule, TuiBarChartModule, TuiLineChartModule, TuiPieChartModule } from "@taiga-ui/addon-charts";
import { TuiFormatNumberPipeModule, TuiHintModule } from "@taiga-ui/core";
import { TuiMoneyModule } from "@taiga-ui/addon-commerce";
import { RentMonthCountComponent } from './components/rent-month-count/rent-month-count.component';
import { HttpClientModule } from "@angular/common/http";
import { RentPeriodCountComponent } from './components/rent-period-count/rent-period-count.component';
import { RentPeriodDebtComponent } from './components/rent-period-debt/rent-period-debt.component';
import { TempChartComponent } from './components/temp-chart/temp-chart.component';
import { PowerChartComponent } from './components/power-chart/power-chart.component';


@NgModule({
  declarations: [
    AnalyticsPageComponent,
    LeakListComponent,
    RentMonthDebtComponent,
    RentMonthCountComponent,
    RentPeriodCountComponent,
    RentPeriodDebtComponent,
    TempChartComponent,
    PowerChartComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    TuiAccordionModule,
    TuiPieChartModule,
    TuiHintModule,
    TuiMoneyModule,
    HttpClientModule,
    TuiAxesModule,
    TuiBarChartModule,
    TuiIslandModule,
    TuiMarkerIconModule,
    TuiLineChartModule,
    TuiFormatNumberPipeModule
  ],
  providers: [
    AnalyticsService
  ]
})
export class AnalyticsModule {
}
