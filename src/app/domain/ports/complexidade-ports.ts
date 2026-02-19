export interface ComplexidadePort {
    obterComplexidade(codigoProcedimento: string): Promise<boolean>
}