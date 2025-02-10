import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { PopupService } from './core/services/popup.service';
import { AuthenticationModule } from "./features/authentication/authentication.module";
import { TestCasesModule } from './features/ui/test-cases/test-cases.module';
import { CoreModule } from './core/core.module';
import { MilestonesModule } from './features/ui/milestones/milestones.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    TestCasesModule,
    MilestonesModule,
    AuthenticationModule
],
  providers: [
    PopupService,
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
