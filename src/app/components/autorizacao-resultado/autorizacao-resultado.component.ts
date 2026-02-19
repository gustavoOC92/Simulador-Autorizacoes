import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { AutorizacaoResultado } from '../../domain/models/autorizacao-resultado.model';

@Component({
  selector: 'app-autorizacao-resultado',
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    FormsModule
],
  templateUrl: './autorizacao-resultado.component.html',
  styleUrl: './autorizacao-resultado.component.scss'
})
export class AutorizacaoResultadoComponent {
  @Input() visible: boolean = false
  @Input() retorno!: AutorizacaoResultado
  @Output() onClose = new EventEmitter<any>()

  fecharDialog() {
    this.onClose.emit()
  }

  get classeStatus() {
    switch (this.retorno.status) {
      case 'AUTORIZADO': return 'pi pi-check-circle';
      case 'NEGADO': return 'pi pi-times';
      case 'EM ESTUDO': return 'pi pi-exclamation-triangle';
    }
  }
}
