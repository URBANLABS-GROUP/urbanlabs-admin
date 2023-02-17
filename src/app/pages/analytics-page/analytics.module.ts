import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AnalyticsPageComponent} from "./analytics-page.component";
import {LeakListComponent} from "./components/leak-list/leak-list.component";
import {AnalyticsRoutingModule} from "./analytics-routing.module";
import {TuiAccordionModule} from "@taiga-ui/kit";
import {AnalyticsService} from "./services/analytics.service";
import { RentDebtComponent } from './components/rent-debt/rent-debt.component';



@NgModule({
  declarations: [
    AnalyticsPageComponent,
    LeakListComponent,
    RentDebtComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    TuiAccordionModule
  ],
  providers: [
    AnalyticsService
  ]
})
export class AnalyticsModule { }
