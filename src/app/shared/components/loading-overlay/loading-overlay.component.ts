import { Component, input } from '@angular/core';
import { TranslatePipe } from "../../pipes/translate.pipe";

@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  templateUrl: './loading-overlay.component.html',
  styleUrl: './loading-overlay.component.scss',
  imports: [TranslatePipe]
})
export class LoadingOverlayComponent {
  readonly loading = input<boolean>(false);
}
