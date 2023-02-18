import { NgModule } from "@angular/core"
import { RouterModule, Routes } from "@angular/router"
import { HomePageComponent } from "./pages/home-page/home-page.component"

const routes: Routes = [
  {
    path: "",
    component: HomePageComponent
  },
  {
    path: "analytics",
    loadChildren: () => import('./pages/analytics-page/analytics.module').then((module) => module.AnalyticsModule)
  },
  {
    path: "notification",
    loadChildren: () => import('./pages/notification/notification.module').then((module) => module.NotificationModule)
  }
]

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {
}
