import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-step-details',
  templateUrl: './step-details.component.html',
  styleUrl: './step-details.component.less'
})
export class StepDetailsComponent {
  fileName: string = 'image.png';
  fileType: string = 'PNG';
  fileSize: string = '324.12 KB';
  uploadedOn: string = '4/12/2024 12:23 AM';
  fileUrl: string = 'https://iram-tests.com';

  constructor(private http: HttpClient) { }

  onDeleteClick() {
    this.http.delete(`/api/files/${this.fileName}`).subscribe(
      () => {
        console.log('File deleted successfully');
        alert('File deleted successfully');
        this.close.emit();
      },
      (error) => {
        console.error('Error deleting file:', error);
        alert('Error deleting file');
      }
    );
  }

  onReplaceClick(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);

    this.http.put(`/api/files/${this.fileName}`, formData).subscribe(
      (response: any) => {
        console.log('File replaced successfully:', response);
        alert('File replaced successfully');
        this.imageUrl = response.imageUrl; // Обновляем URL изображения
        this.fileName = file.name; // Обновляем имя файла
        this.fileSize = `${(file.size / 1024).toFixed(2)} KB`; // Обновляем размер файла
        // Обновите другие детали, если необходимо
      },
      (error) => {
        console.error('Error replacing file:', error);
        alert('Error replacing file');
      }
    );
  }

  onFullResolutionClick() {
    window.open(this.imageUrl, '_blank');
  }

  onDoneClick() {
    this.close.emit();
  }

  @Input() imageUrl: string = '';
  @Output() close = new EventEmitter<void>();

  closePopup() {
    this.close.emit();
  }
}
