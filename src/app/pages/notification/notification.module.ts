import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeakListComponent } from "./components/leak-list/leak-list.component";
import { AnalyticsService } from "../analytics-page/services/analytics.service";
import { NotificationComponent } from './components/notification/notification.component';
import { NotificationRoutingModule } from "./notification-routing.module";
import { TuiAccordionModule, TuiMarkerIconModule } from "@taiga-ui/kit";
import { TuiFormatNumberPipeModule } from "@taiga-ui/core";


@NgModule({
  declarations: [
    LeakListComponent,
    NotificationComponent,
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    TuiAccordionModule,
    TuiMarkerIconModule,
    TuiFormatNumberPipeModule

  ],
  providers: [
    AnalyticsService
  ]
})
export class NotificationModule {
}
