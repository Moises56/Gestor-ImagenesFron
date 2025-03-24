import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ImageGalleryComponent } from '../image-gallery/image-gallery.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ImageGalleryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'gestor-img';
}
