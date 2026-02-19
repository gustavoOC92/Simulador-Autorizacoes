import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DividerModule } from 'primeng/divider';
import { TableModule } from 'primeng/table';
import { AutorizacaoService } from '../../services/autorizacao.service';
import { PrestadorService } from '../../services/prestador.service';
import { Prestador } from '../../domain/models/prestador.model';
import { Autorizacao } from '../../domain/models/autorizacao.model';
import { DadosBeneficiarioStateService } from '../../services/dados-beneficiario-state.service';
import { InserirProcedimentosComponent } from '../inserir-procedimentos/inserir-procedimentos.component';
import { DialogAvisoComponent } from '../../shared/components/dialog-aviso/dialog-aviso.component';
import { Router } from '@angular/router';
import { Procedimentos } from '../../domain/models/procedimentos.model';
import { ProcedimentoAutorizacao } from '../../domain/models/procedimento-autorizacao.model';
import { AutorizacaoResultadoComponent } from '../autorizacao-resultado/autorizacao-resultado.component';
import { AutorizacaoResultado } from '../../domain/models/autorizacao-resultado.model';

@Component({
  selector: 'app-autorizacao-guia',
  imports: [
    ButtonModule,
    CardModule,
    DividerModule,
    InputTextModule,
    SelectModule,
    TableModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    InserirProcedimentosComponent,
    DialogAvisoComponent,
    AutorizacaoResultadoComponent,
    NgIf
  ],
  templateUrl: './autorizacao-guia.component.html',
  styleUrl: './autorizacao-guia.component.scss'
})
export class AutorizacaoGuiaComponent implements OnInit {
  numeroCarteira: string = ''
  nomeBeneficiario: string = ''
  dataNascimento: Date = new Date
  plano: string = ''

  prestadores: Prestador[] = []

  procedimentoSelecionado: Procedimentos | undefined

  procedimentosGuia: ProcedimentoAutorizacao[] = []

  exibirDialogInserirProcedimentos: boolean = false

  mensagemAviso: string = ''
  exibirDialogAviso: boolean = false

  exibirDialogResultado: boolean = false

  result = signal<AutorizacaoResultado | null>(null);

  formGuia: FormGroup = new FormGroup({
    prestador: new FormControl({ value: '', disabled: false }),
    codigoPrestador: new FormControl({ value: '', disabled: true }),
    cnes: new FormControl({ value: '', disabled: true }),
    quantidadeProcedimento: new FormControl({ value: '', disabled: false }),
  })

  constructor(
    private readonly autorizacaoService: AutorizacaoService,
    private readonly prestadorService: PrestadorService,
    private beneficiarioState: DadosBeneficiarioStateService,
    private router: Router) { }

  ngOnInit(): void {
    const beneficiario = this.beneficiarioState.getBeneficiario();

    this.numeroCarteira = beneficiario?.numeroCarteira!
    this.nomeBeneficiario = beneficiario?.nome!
    this.dataNascimento = beneficiario?.dataNascimento!
    this.plano = beneficiario?.plano!

    this.listarPrestadores()

    this.formGuia.get('prestador')?.valueChanges.subscribe(prestadorSelecionado => {
      if (prestadorSelecionado) {
        this.formGuia.patchValue({
          codigoPrestador: prestadorSelecionado.codigoPrestador,
          cnes: prestadorSelecionado.cnes
        });
      }
    });
  }

  listarPrestadores() {
    this.prestadorService.listarPrestadores()
      .subscribe({
        next: (response) => {
          this.prestadores = [
            { codigoPrestador: '', nomePrestador: 'Selecione o Prestador', cnes: '' },
            ...response
              .sort((a, b) => a.nomePrestador.localeCompare(b.nomePrestador)),
          ];
        }
      })
  }

  abrirDialogInserirProcedimentos() {
    this.exibirDialogInserirProcedimentos = true
  }

  fecharDialogInserirProcedimentos() {
    this.exibirDialogInserirProcedimentos = false
  }

  cancelarPreenchimentoGuia() {
    this.router.navigate(['/'])
  }

  fecharDialogAviso() {
    this.exibirDialogAviso = false
  }

  fecharDialogResultado() {
    this.exibirDialogResultado = false
    this.router.navigate(['/'])
  }

  inserirProcedimento(procedimento: ProcedimentoAutorizacao) {
    const procedimentoExiste = this.procedimentosGuia.find(p => p.codigoProcedimento == procedimento.codigoProcedimento)

    if (procedimentoExiste) {
      this.mensagemAviso = 'Procedimento já adicionado!'
      this.exibirDialogAviso = true
      return
    }

    this.exibirDialogInserirProcedimentos = false
    this.procedimentosGuia.push(procedimento)
  }

  removerProcedimento(codigoProcedimento: string) {
    const index = this.procedimentosGuia.findIndex(p => p.codigoProcedimento == codigoProcedimento)

    if (index >= 0) {
      this.procedimentosGuia.splice(index, 1)
    }
  }

  async enviarAutorizacao() {

    if (this.validarPreenchimentoAutorizacao()) {
      const payload: Autorizacao = {
        numeroCarteira: this.numeroCarteira,
        codigoPrestador: this.formGuia.get('codigoPrestador')?.value,
        procedimentos: this.procedimentosGuia,
      }

      const retorno = await this.autorizacaoService.simulate(payload)
      this.result.set(retorno);

      this.exibirDialogResultado = true
    }
  }

  validarPreenchimentoAutorizacao(): boolean | undefined {
    if (this.numeroCarteira == undefined) {
      this.mensagemAviso = 'Volte e informe uma carteira de beneficiário!'
      this.exibirDialogAviso = true
      return false
    }

    if (this.formGuia.get('codigoPrestador')?.value == '') {
      this.mensagemAviso = 'Selecione um Prestador!'
      this.exibirDialogAviso = true
      return false
    }

    if (this.procedimentosGuia.length == 0) {
      this.mensagemAviso = 'Insira ao menos um Procedimento!'
      this.exibirDialogAviso = true
      return false
    }

    return true
  }
}
