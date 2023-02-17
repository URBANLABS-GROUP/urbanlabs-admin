import { NgModule } from "@angular/core"
import { BrowserModule } from "@angular/platform-browser"
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { TUI_SANITIZER, TuiAlertModule, TuiDialogModule, TuiRootModule } from "@taiga-ui/core"
import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify"

import { AppRoutingModule } from "./app-routing.module"
import { AppComponent } from "./app.component"
import { HomePageComponent } from "./pages/home-page/home-page.component"
import {AnalyticsModule} from "./pages/analytics-page/analytics.module";

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    AnalyticsModule
  ],
  providers: [ { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer } ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}
