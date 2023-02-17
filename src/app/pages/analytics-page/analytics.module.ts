import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AnalyticsPageComponent} from "./analytics-page.component";
import {LeakListComponent} from "./components/leak-list/leak-list.component";
import {AnalyticsRoutingModule} from "./analytics-routing.module";
import {TuiAccordionModule} from "@taiga-ui/kit";



@NgModule({
  declarations: [
    AnalyticsPageComponent,
    LeakListComponent
  ],
  imports: [
    CommonModule,
    AnalyticsRoutingModule,
    TuiAccordionModule
  ]
})
export class AnalyticsModule { }
