export interface CarenciaPort {
  obterCarencia(codigoProcedimento: string, numeroCarteira: string): Promise<boolean>
}