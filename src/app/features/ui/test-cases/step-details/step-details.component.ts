import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, EventEmitter, Input, Output, OnInit, ViewChild, ElementRef } from '@angular/core';
import { environment } from "../../../../../environments/environment";
import { StepService } from '../../../../core/services/step.service';
import { UpdateStepDTO, StepDTO } from "../../../../core/models/step-dto";

@Component({
  selector: 'app-step-details',
  templateUrl: './step-details.component.html',
  styleUrls: ['./step-details.component.less']
})
export class StepDetailsComponent implements OnInit {
  fileName: string = '';
  fileType: string = '';
  fileSize: string = '';
  uploadedOn: string = '';
  fileUrl: string = '';
  fileId: string | null = null;
  loading: boolean = false;
  isLocalImage: boolean = false;
  selectedFiles: FileList | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef;

  @Input() imageUrls: string[] = [];
  // Додаємо властивість для expected images:
  @Input() expectedImageUrls: string[] = [];

  @Input() stepId: string = '';
  @Input() index!: number;
  @Output() close = new EventEmitter<void>();
  @Output() imageDeleted = new EventEmitter<number>();
  @Output() imageUploaded = new EventEmitter<{ index: number; imageUrl: string }>();
  @Output() stepUpdated = new EventEmitter<StepDTO>();

  constructor(private http: HttpClient, private stepService: StepService) { }

  ngOnInit(): void {
    if (this.imageUrls && this.imageUrls.length > 0) {
      this.extractFileInfoFromUrl(this.imageUrls[0]);
    }
    if (this.expectedImageUrls && this.expectedImageUrls.length > 0) {
      console.log('Expected image URL:', this.expectedImageUrls[0]);
    }
  }

  onDeleteClick() {
    // Логіка видалення не змінюється (якщо потрібно – окремо для expected images)
    if (this.isLocalImage) {
      this.imageUrls = [];
      this.fileName = '';
      this.fileType = '';
      this.fileSize = '';
      this.uploadedOn = '';
      this.fileUrl = '';
      this.fileId = null;
      this.isLocalImage = false;
      this.imageDeleted.emit(this.index);
      this.updateStep(null, null);
    } else {
      if (!this.fileId) {
        console.warn('No image to delete.');
        this.updateStep(null, null);
        return;
      }
      const apiUrl = `${environment.apiUrl}/files/${this.fileId}`;
      this.http.delete(apiUrl).subscribe({
        next: () => {
          console.log('File deleted successfully');
          alert('File deleted successfully');
          this.imageUrls = [];
          this.fileName = '';
          this.fileType = '';
          this.fileSize = '';
          this.uploadedOn = '';
          this.fileUrl = '';
          this.fileId = null;
          this.isLocalImage = false;
          this.imageDeleted.emit(this.index);
          this.updateStep(null, null);
        },
        error: (error) => {
          console.error('Error deleting file:', error);
          alert('Error deleting file');
        }
      });
    }
  }

  onFileSelected(event: any): void {
    this.selectedFiles = event.target.files;
  }

  onReplaceClick(): void {
    if (!this.selectedFiles || this.selectedFiles.length === 0) {
      alert('Please select a file first!');
      return;
    }

    this.loading = true;
    const testCaseId = 'yourTestCaseId'; // Замініть на актуальний testCaseId
    const stepId = this.stepId;

    const formData = new FormData();
    for (let i = 0; i < this.selectedFiles.length; i++) {
      formData.append('image', this.selectedFiles[i], this.selectedFiles[i].name);
    }

    this.http.post<StepDTO>(`${environment.apiUrl}/test-cases/${testCaseId}/steps/${stepId}/upload-image`, formData)
      .subscribe({
        next: (response: StepDTO) => {
          console.log('Images uploaded successfully:', response);
          this.imageUrls = response.image || [];
          if (this.imageUrls.length > 0) {
            this.extractFileInfoFromUrl(this.imageUrls[0]);
          }
          this.imageUploaded.emit({ index: this.index, imageUrl: this.imageUrls[0] });
          // Оновлюємо обидва поля: звичайні images та expected images
          this.updateStep(this.imageUrls, this.expectedImageUrls);
          this.loading = false;
        },
        error: (error) => {
          console.error('Error uploading images:', error);
          alert('Error uploading images');
          this.loading = false;
        }
      });
  }

  // Оновлюємо метод updateStep, щоб передавати expectedImage окремо
  updateStep(newImageUrls: string[] | null, newExpectedImageUrls: string[] | null) {
    if (!this.stepId) {
      console.error('Step ID is missing!');
      return;
    }
    const updateData: UpdateStepDTO = {
      stepId: this.stepId,
      image: newImageUrls,
      expectedImage: newExpectedImageUrls
    };
    this.stepService.updateStep(this.stepId, updateData)
      .subscribe({
        next: (response: StepDTO) => {
          console.log('Step updated successfully:', response);
          this.stepUpdated.emit(response);
        },
        error: (error) => {
          console.error('Error updating step:', error);
          alert('Error updating step');
        }
      });
  }

  onFullResolutionClick() {
    if (this.imageUrls && this.imageUrls.length > 0) {
      window.open(this.imageUrls[0], '_blank');
    }
  }

  onDoneClick() {
    this.close.emit();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.selectedFiles = files;
      this.onReplaceClick();
    }
  }

  private extractFileInfoFromUrl(imageUrl: string) {
    if (imageUrl) {
      try {
        const url = new URL(imageUrl);
        const pathnameParts = url.pathname.split('/');
        this.fileName = pathnameParts[pathnameParts.length - 1];
        this.fileUrl = imageUrl;
        const extension = this.fileName.split('.').pop();
        if (extension) {
          this.fileType = `image/${extension}`;
        }
        const fileIdMatch = imageUrl.match(/\/files\/([a-zA-Z0-9-]+)/);
        if (fileIdMatch && fileIdMatch[1]) {
          this.fileId = fileIdMatch[1];
          this.isLocalImage = false;
        } else {
          this.isLocalImage = true;
        }
      } catch (error) {
        console.error("Error parsing image URL:", error);
        this.fileName = "Unknown";
        this.fileType = "Unknown";
        this.fileSize = "Unknown";
        this.uploadedOn = "Unknown";
        this.fileUrl = "";
        this.isLocalImage = true;
      }
    }
  }

  resetFileInput() {
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
}
