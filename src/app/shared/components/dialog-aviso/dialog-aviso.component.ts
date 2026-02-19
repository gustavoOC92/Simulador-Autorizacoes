import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common'
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-dialog-aviso',
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule
  ],
  templateUrl: './dialog-aviso.component.html',
  styleUrl: './dialog-aviso.component.scss'
})
export class DialogAvisoComponent {
  @Input() visible: boolean = false
  @Input() mensagem: string = ''
  @Output() onClose = new EventEmitter<any>()

  fecharDialog() {
    this.onClose.emit()
  }
}
