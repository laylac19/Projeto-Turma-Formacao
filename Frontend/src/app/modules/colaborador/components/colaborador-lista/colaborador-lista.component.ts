import {Component, OnInit, ViewChild} from '@angular/core';
import {ColaboradorModel} from '../../models/ColaboradorModel';
import {ColaboradorService} from '../../service/colaborador.service';
import {SenioridadeService} from '../../../senioridade/service/senioridade.service';
import { CadastrarColaboradorModel } from '../../models/cadastro-colaborador.model';
import { ColaboradorFormComponent } from './colaborador-form/colaborador-form.component';
import {ConfirmationService, MessageService} from "primeng/api";
import {FuncoesUtil} from "../../../../shared/FuncoesUtil";

@Component({
    selector: 'app-colaborador-lista',
    templateUrl: './colaborador-lista.component.html',
    styleUrls: ['./colaborador-lista.component.scss']
})
export class ColaboradorListaComponent implements OnInit {
    colaboradores: ColaboradorModel[] = [];
    senioridades: any[] = [];
    coloumns: any[] = [];

    colaboradorAlteracao : CadastrarColaboradorModel;

    @ViewChild('dtColaborador') table: ColaboradorModel;

    @ViewChild('colaboradorForm') colaboradorForm: ColaboradorFormComponent;

    visivel : boolean = false;

    constructor(
        private colaboradorService: ColaboradorService,
        private senioridadeService: SenioridadeService,
        private _messageService: MessageService,
        private confirmService: ConfirmationService
    ) {
    }

    ngOnInit(): void {
        this.getColaboradores();
        this.getSenioridade();
        this.coloumns = [
            {field: 'nome', header: 'Nome'},
            {field: 'nomeSenioridade', header: 'Senioridade'},
            {header: 'Ação'}
        ];
    }

    getColaboradores(): void {
        this.colaboradorService.getColaborador()
            .subscribe(colaboradores => this.colaboradores = colaboradores);
        this.visivel = false;
    }

    getSenioridade(): void {
        this.senioridadeService.getSenioridades()
            .subscribe(senioridades => this.senioridades = senioridades.map(senioridade => ({
                label: senioridade.descricao,
                value: senioridade.descricao
            })));
    }

    abrirDialogAlterar(colaborador : ColaboradorModel) : void {
        this.visivel = !this.visivel;
        this.colaboradorForm.buscarColaboradorPorId(colaborador.id);
    }

    abirDadosColaborador(colaborador : ColaboradorModel):void {
        this.visivel = !this.visivel;
        this.colaboradorService.buscarColaboradorPorId(colaborador.id);
    }

    limparFormularioFilho() : void {
        this.colaboradorForm.limparFormulario()
    }

    excluirColaborador(id) {
        this.colaboradorService.deleteColaborador(id).subscribe(
            () => {
                this._messageService.add({
                    severity: 'success', summary: 'Sucesso ao Excluir',
                    detail: 'O Colaborador foi Excluído com Sucesso!',
                })
                this.getColaboradores();
            },
            () => {
                this._messageService.add({
                    severity: 'error', summary: 'Ocorreu um Error ao Excluir',
                })
            }
        );
    }

    confirmation (id) {
        this.confirmService.confirm(FuncoesUtil.createConfirmation('Tem certeza de que deseja prosseguir?','Confirmação',
            () => this.excluirColaborador(id), 'Sim', 'Não'));
    }
}
