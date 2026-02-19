import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { ProcedimentoService } from '../../services/procedimento.service';
import { Procedimentos } from '../../domain/models/procedimentos.model';
import { Tabela } from '../../domain/models/tabela.model';
import { ProcedimentoAutorizacao } from '../../domain/models/procedimento-autorizacao.model';

@Component({
  selector: 'app-inserir-procedimentos',
  imports: [
    ButtonModule,
    CommonModule,
    DialogModule,
    SelectModule,
    AutoCompleteModule,
    FormsModule,
    InputTextModule
  ],
  templateUrl: './inserir-procedimentos.component.html',
  styleUrl: './inserir-procedimentos.component.scss'
})
export class InserirProcedimentosComponent implements OnInit {
  @Input() visible: boolean = false
  @Output() procedimentoAutorizacao = new EventEmitter<ProcedimentoAutorizacao>();
  @Output() onClose = new EventEmitter<any>()

  tabelaProcedimentos: Tabela[] = []
  tabelaSelecionada: Tabela | undefined

  procedimentos: Procedimentos[] = []
  procedimentosFiltrados: Procedimentos[] = []
  procedimentoSelecionado: Procedimentos | undefined

  quantidadeProcedimento: number = 0

  constructor(private readonly procedimentoService: ProcedimentoService) { }

  ngOnInit(): void {
    this.tabelaProcedimentos = [
      { codigoTabela: '01', nomeTabela: 'Procedimentos' },
      { codigoTabela: '02', nomeTabela: 'Medicamentos' },
      { codigoTabela: '03', nomeTabela: 'Serviços Hospitalares' }
    ]
  }

  listarProcedimentos(tabela?: Tabela) {
    if (tabela !== undefined) {
      this.procedimentoService.listarProcedimentosPorTabela(tabela.nomeTabela)
        .subscribe({
          next: (response) => {
            this.procedimentoSelecionado = undefined
            this.quantidadeProcedimento = 0
            this.procedimentos = response
          }
        })
    }
  }

  filtrarProcedimentos(event: AutoCompleteCompleteEvent) {
    let filtro: Procedimentos[] = [];
    let query = event.query;

    for (let i = 0; i < (this.procedimentos as any[]).length; i++) {
      let item = (this.procedimentos as any[])[i];
      if (item.descricaoProcedimento.toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtro.push(item);
      }
    }

    this.procedimentosFiltrados = filtro;
  }

  fecharDialog() {
    this.tabelaSelecionada = undefined
    this.onClose.emit()
  }

  inserirProcedimento() {
    const procedimento: ProcedimentoAutorizacao = {
      tabelaProcedimento: this.procedimentoSelecionado?.tabela!,
      codigoProcedimento: this.procedimentoSelecionado?.codigoProcedimento!,
      descricaoProcedimento: this.procedimentoSelecionado?.descricaoProcedimento!,
      quantidadeProcedimento: this.quantidadeProcedimento
    }

    this.tabelaSelecionada = undefined
    this.procedimentoSelecionado = undefined
    this.quantidadeProcedimento = 0
    
    this.procedimentoAutorizacao.emit(procedimento)
  }
}
