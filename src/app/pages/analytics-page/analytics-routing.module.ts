import {RouterModule, Routes} from "@angular/router";
import {AnalyticsPageComponent} from "./analytics-page.component";
import {NgModule} from "@angular/core";

const routes: Routes = [
  {
    path: "",
    component: AnalyticsPageComponent
  }
]

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class AnalyticsRoutingModule {
}