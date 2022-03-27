import {CadastrarCompetenciaModel} from "../../competencia/models/cadastro-competencia.model";

export class CadastrarColaboradorModel {
    constructor(
        public id: number,
        public nome: string,
        public sobrenome: string,
        public cpf: string,
        public email: string,
        public dataNascimento: Date,
        public dataAdmissao: Date,
        public foto: string,
        public idSenioridade: number,
        public competencia: Array<CadastrarCompetenciaModel>,
    ) {
    }
}
