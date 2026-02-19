import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DialogAvisoComponent } from '../../shared/components/dialog-aviso/dialog-aviso.component';
import { BeneficiarioService } from '../../services/beneficiario.service';
import { Router } from '@angular/router';
import { DadosBeneficiarioStateService } from '../../services/dados-beneficiario-state.service';

@Component({
  selector: 'app-autorizacao-identificacao',
  imports: [
    FormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    DialogAvisoComponent
  ],
  templateUrl: './autorizacao-identificacao.component.html',
  styleUrl: './autorizacao-identificacao.component.scss'
})
export class AutorizacaoIdentificacaoComponent {
  numeroCarteira: string = ''
  exibirDialogAviso: boolean = false
  mensagemAviso: string = ''

  constructor(
    private readonly beneficiarioService: BeneficiarioService, 
    private beneficiarioState: DadosBeneficiarioStateService,
    private router: Router) { }

  verificaCarteira() {
    if (this.numeroCarteira == '') {
      this.mensagemAviso = 'Informe um número de carteira'
      this.exibirDialogAviso = true
    }
    else {
      this.beneficiarioService.buscarBeneficiario(this.numeroCarteira)
        .subscribe({
          next: (response) => {
            if (response != null) {
              let beneficiario = response.filter(r => r.numeroCarteira == this.numeroCarteira)
              
              if (beneficiario.length > 0) {
                this.beneficiarioState.setBeneficiario(beneficiario[0])
                this.router.navigate(['/autorizacao-guia']);
              } else {
                this.mensagemAviso = 'Beneficiário não encontrado!'
                this.exibirDialogAviso = true
              }
            }
          }
        })
    }
  }

  fecharDialogAviso() {
    this.exibirDialogAviso = false
  }
}
