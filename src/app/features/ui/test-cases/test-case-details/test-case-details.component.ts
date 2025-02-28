import { Component } from '@angular/core';
import { StepDTO } from '../../../../core/models/step-dto';

@Component({
  selector: 'app-test-case-details',
  templateUrl: './test-case-details.component.html',
  styleUrl: './test-case-details.component.less'
})
export class TestCaseDetailsComponent {
  steps: StepDTO[];

  ngOnInit() {
    this.steps = [
      {
        stepId: '1',
        stepDescription: 'To push on gaming laptop category',
        expectedResult: 'Opens a page with side categories',
        image: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYGRvxuw3XyDl76icr5Zq5ljZh74QUabExVg&s', 'https://pl.canalplus.com/blog/_next/image?url=http%3A%2F%2Fwordpress%3A80%2Fblog%2Fwp%2Fwp-content%2Fuploads%2Fbarbie-ryan-gosling-filmy-e1695757159714.jpg&w=3840&q=75'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];
  }

  selectedImageUrl: string = '';
  showPopup: boolean = false;

  openPopup(imageUrl: string) {
    this.selectedImageUrl = imageUrl;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }
}
