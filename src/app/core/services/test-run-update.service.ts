import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestRunUpdateService {
  private testRunUpdatedSource = new Subject<void>();
  testRunUpdated$ = this.testRunUpdatedSource.asObservable();

  notifyTestRunUpdated() {
    this.testRunUpdatedSource.next();
  }
}
