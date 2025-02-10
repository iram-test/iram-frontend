import { Component, ViewChild } from '@angular/core';
import { LoginComponent } from './features/authentication/login/login.component';
import { PopupService } from './core/services/popup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'Iram';
}
