import { ChangeDetectionStrategy, Component, ElementRef, input, output, viewChild } from '@angular/core';
import { TranslatePipe } from "../../pipes/translate.pipe";

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmDialogComponent {
  readonly modalId = input.required<string>(); // should match the checkbox id
  readonly titleKey = input('confirmTitle');
  readonly messageKey = input('');
  readonly confirmKey = input('confirm');
  readonly cancelKey = input('cancel');

  readonly confirm = output<void>();
  readonly cancel = output<void>();

  readonly modalInput = viewChild<ElementRef<HTMLInputElement>>('modal');

  open(): void {
    const el = this.modalInput()?.nativeElement;
    if (el) el.checked = true;
  }

  close(): void {
    const el = this.modalInput()?.nativeElement;
    if (el) el.checked = false;
  }
}
