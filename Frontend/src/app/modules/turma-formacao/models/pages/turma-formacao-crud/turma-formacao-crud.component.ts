import {CompetenciaListaModel} from '../../CompetenciaListaModel';
import {ColaboradorListaModel} from '../../ColaboradorListaModel';
import {
    TurmaColaboradorCompetenciaNivelModel
} from '../../../../turma-colaborador-competencia/models/TurmaColaboradorCompetenciaNivelModel';
import {TurmaFormacaoModel} from '../../TurmaFormacaoModel';
import {turmaFormacaoService} from '../../../service/turma-formacao.service';
import {Component, OnInit, ViewChild} from '@angular/core';
import {
    TurmaColaboradorCompetenciaModel
} from 'src/app/modules/turma-colaborador-competencia/models/TurmaColaboradorCompetenciaModel';
import {FuncoesUtil} from "../../../../../shared/FuncoesUtil";
import {ConfirmationService, MessageService, SelectItem} from "primeng/api";


@Component({
    selector: 'app-turma-formacao-crud',
    templateUrl: './turma-formacao-crud.component.html',
    styleUrls: ['./turma-formacao-crud.component.scss']
})
export class TurmaFormacaoCrudComponent implements OnInit {

    display: boolean = false;
    colab: boolean = false;
    succes: boolean = false;
    displayAlt: boolean = false;

    turmas: TurmaFormacaoModel[] = [];
    colaboradoresDisponiveis: ColaboradorListaModel[] = [];
    colaboradoresTotal: ColaboradorListaModel[] = [];
    competenciasTotal: CompetenciaListaModel[] = [];
    competenciasDisponiveis: CompetenciaListaModel[] = [];
    colaboradorCompetenciaHolder: TurmaColaboradorCompetenciaNivelModel[] = [];

    turmaFormacaoModel: TurmaFormacaoModel;
    turmaDetalhada: TurmaFormacaoModel;
    colaboradorHolder: TurmaColaboradorCompetenciaNivelModel;
    colaboradorDropDown: ColaboradorListaModel;
    competenciaDropDown: CompetenciaListaModel;

    inputNomeTurma: String;
    inputDescricaoTurma: String;
    statusDisponiveis: any[] = [];
    dropdownSenioridade: SelectItem[] = [
        {value: 1, label: "Estagiário"},
        {value: 2, label: "Júnior"},
        {value: 3, label: "Pleno"},
        {value: 4, label: "Sênior"},
    ];

    @ViewChild('dt') table: TurmaFormacaoModel;

    ngOnInit(): void {
        this.listarTurmas();
        this.listarColaboradoresAutoComplete();
        this.listarCompetenciasAutoComplete();
        this.colaboradorHolder = new TurmaColaboradorCompetenciaNivelModel(
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null);
    }

    constructor(
        private turmaFormacaoService: turmaFormacaoService,
        private messageService: MessageService,
        private confirmService: ConfirmationService){
    }

    showDialog() {
        this.display = true;
    }

    showColab() {
        this.colab = true;
    }

    private showSucess() {
        this.messageService.add({severity: 'success', summary: 'Sucesso'});
    }

    private showSucessIniciada() {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'turma iniciada'});
    }

    private showSucessFinalizada() {
        this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'turma finalizadda'});
    }

    showDialogAlt(turma: TurmaFormacaoModel) {
        this.displayAlt = true;
        this.turmaDetalhada = turma;
        this.inputDescricaoTurma = turma.descricao;
        this.inputNomeTurma = turma.nome;
    }

    showDialogDados(turma: TurmaFormacaoModel) {
        this.displayAlt = true;
        this.turmaDetalhada = turma;
        this.inputDescricaoTurma = turma.descricao;
        this.inputNomeTurma = turma.nome;
    }

    listarTurmas() {
        this.turmaFormacaoService.obterTodasTurmasComURL().subscribe(turmas => {
            this.turmas = turmas;
        })

        this.turmaFormacaoService.listarStatus()
            .subscribe((statusTurma) => this.statusDisponiveis = statusTurma.map(status => ({
                label: status.descricao,
                value: status.descricao,
            })));
    }

    listarColaboradoresAutoComplete() {
        this.turmaFormacaoService.listarColaborador().subscribe(colaborador => {
            this.colaboradoresTotal = colaborador;
        });
    }

    listarCompetenciasAutoComplete() {
        this.turmaFormacaoService.listarCompetencia().subscribe(competencia => {
            this.competenciasTotal = competencia;
        });
    }

    listarTurmaColaboradorCompetencia(turmaId: number) {
        this.turmaFormacaoService.listarTurmaColaboradorCompetencia(turmaId).subscribe(colaborador => {
            colaborador.forEach(colaboradorTemp => {
                if (colaboradorTemp.nivel == 0) {
                    colaboradorTemp.nivelNome = "Estagiario";
                }
                if (colaboradorTemp.nivel == 1) {
                    colaboradorTemp.nivelNome = "Junior";
                }
                if (colaboradorTemp.nivel == 2) {
                    colaboradorTemp.nivelNome = "Plenio";
                }
                if (colaboradorTemp.nivel == 3) {
                    colaboradorTemp.nivelNome = "Senior";
                }
            });
            this.colaboradorCompetenciaHolder = colaborador;
        });
    }

    inserirTurma() {
        this.turmaFormacaoModel = new TurmaFormacaoModel(this.inputNomeTurma, this.inputDescricaoTurma, null, null, 1, null);
        this.inputNomeTurma = null;
        this.inputDescricaoTurma = null;
        this.turmaFormacaoService.registrarTurma(this.turmaFormacaoModel).subscribe(
            turma => {
                this.showSucess();
                return this.inserirListaColaboradorSemLimpar(turma.id);
            }
        );
        this.display = false;
    }

    inserirListaColaborador(turmaId: number) {
        let turmaColaboradoresTemp: TurmaColaboradorCompetenciaModel[] = [];
        this.turmaFormacaoService.listarTurmaColaboradorCompetencia(turmaId).subscribe(colaboradoresTurma => {
            turmaColaboradoresTemp = colaboradoresTurma;
        });
        this.colaboradorCompetenciaHolder.forEach(colaborador => {
                let turmaTemp = new TurmaColaboradorCompetenciaModel(turmaId, colaborador.colaboradorId, colaborador.competenciaId);
                if (turmaColaboradoresTemp.indexOf(turmaTemp) == -1) {
                    this.turmaFormacaoService.registrarTurmaColaboradorCompetencia(turmaTemp).subscribe(retorno => {
                        console.log("certo");
                    });
                }
            }
        );
        this.succes = true;
        this.colaboradorCompetenciaHolder = [];
        this.listarTurmas();
    }

    inserirListaColaboradorSemLimpar(turmaId: number) {
        let colaboradoresDaTurma: TurmaColaboradorCompetenciaModel[] = [];
        this.turmaFormacaoService.listarTurmaColaboradorCompetencia(turmaId).subscribe(colaboradoresTurma => {
            colaboradoresDaTurma = colaboradoresTurma;
        });
        this.colaboradorCompetenciaHolder.forEach(colaborador => {
                let turmaTemp = new TurmaColaboradorCompetenciaModel(turmaId, colaborador.colaboradorId, colaborador.competenciaId);
                if (colaboradoresDaTurma.indexOf(turmaTemp) == -1) {
                    this.turmaFormacaoService.registrarTurmaColaboradorCompetencia(turmaTemp).subscribe(retorno => {
                        console.log("certo");
                    });
                }
            }
        );
        this.succes = true;
        this.listarTurmas();
    }

    inserirTurmaIniciando() {
        this.turmaFormacaoModel = new TurmaFormacaoModel(this.inputNomeTurma, this.inputDescricaoTurma, new Date, null, 2, null);
        this.inputNomeTurma = null;
        this.inputDescricaoTurma = null;
        this.turmaFormacaoService.registrarTurma(this.turmaFormacaoModel).subscribe(
            turma => {
                this.showSucess();
                return this.inserirListaColaborador(turma.id)
            }
        );
        this.succes = true;
        this.display = false;
    }

    inserirColaboradorCompetenciaHolder() {
        let colaboradorObj = null;
        this.turmaFormacaoService.procurarNivelColaboradorCompetencia(this.colaboradorDropDown.id, this.competenciaDropDown.id)
            .subscribe(colaboradorTempAdd => {
                colaboradorObj = colaboradorTempAdd;
                if (colaboradorObj == null) {
                    this.turmaFormacaoService.cadastrarColaboradorCompetenciaZero(this.colaboradorDropDown.id, this.competenciaDropDown.id).subscribe(temp => {
                        this.turmaFormacaoService.procurarNivelColaboradorCompetencia(this.colaboradorDropDown.id, this.competenciaDropDown.id).subscribe(colaboradorTemp => {
                            if (this.colaboradorCompetenciaHolder.findIndex((colaborador) => colaborador.colaboradorId === this.colaboradorDropDown.id && colaborador.competenciaId === this.competenciaDropDown.id) == -1) {
                                if (colaboradorTemp.nivel == 0) {
                                    colaboradorTemp.nivelNome = "Estagiario";
                                }
                                if (colaboradorTemp.nivel == 1) {
                                    colaboradorTemp.nivelNome = "Junior";
                                }
                                if (colaboradorTemp.nivel == 2) {
                                    colaboradorTemp.nivelNome = "Plenio";
                                }
                                if (colaboradorTemp.nivel == 3) {
                                    colaboradorTemp.nivelNome = "Senior";
                                }
                                this.colaboradorCompetenciaHolder.push(colaboradorTemp);
                            }
                            this.colaboradorDropDown = new ColaboradorListaModel(null, null, null);
                            this.competenciaDropDown = new CompetenciaListaModel(null, null);
                        })
                    })
                } else {
                    this.turmaFormacaoService.procurarNivelColaboradorCompetencia(this.colaboradorDropDown.id, this.competenciaDropDown.id).subscribe(colaboradorTemp => {
                        if (this.colaboradorCompetenciaHolder.findIndex((colaborador) => colaborador.colaboradorId === this.colaboradorDropDown.id && colaborador.competenciaId === this.competenciaDropDown.id) == -1) {
                            if (colaboradorTemp.nivel == 0) {
                                colaboradorTemp.nivelNome = "Estagiario";
                            }
                            if (colaboradorTemp.nivel == 1) {
                                colaboradorTemp.nivelNome = "Junior";
                            }
                            if (colaboradorTemp.nivel == 2) {
                                colaboradorTemp.nivelNome = "Pleno";
                            }
                            if (colaboradorTemp.nivel == 3) {
                                colaboradorTemp.nivelNome = "Senior";
                            }
                            this.colaboradorCompetenciaHolder.push(colaboradorTemp);
                        }
                        this.colaboradorDropDown = new ColaboradorListaModel(null, null, null);
                        this.competenciaDropDown = new CompetenciaListaModel(null, null);
                    })
                }
            }, erro => {

            });
    }

    iniciarTurma(turma: TurmaFormacaoModel) {
        turma.statusId = 2;
        this.turmaFormacaoService.alterarTurma(turma).subscribe(
            turma => {
                this.showSucessIniciada();
                this.displayAlt = false;
            }
        );
    }

    finalizarTurma(turma: TurmaFormacaoModel) {
        turma.statusId = 3;
        turma.termino = new Date;
        this.turmaFormacaoService.alterarTurma(turma).subscribe(
            turma => {
                this.showSucessFinalizada();
                this.listarTurmas();
                this.displayAlt = false;
            }
        );
        this.listarTurmaColaboradorCompetencia(turma.id);
        this.colaboradorCompetenciaHolder.forEach(colaborador =>
            this.turmaFormacaoService.subirNivelColaboradorCompetencia(colaborador.colaboradorId, colaborador.competenciaId)
                .subscribe(retorno => {
            })
        );
    }

    alterarTurma(turma: TurmaFormacaoModel) {
        turma.nome = this.inputNomeTurma;
        turma.descricao = this.inputDescricaoTurma;
        this.turmaFormacaoService.alterarTurma(turma).subscribe(
            turma => {
                console.log("certo");
            }
        );
        this.inserirListaColaborador(turma.id);
        this.displayAlt = false;
    }

    limparHolderColaboradorCompetencia(event) {
        this.colaboradorCompetenciaHolder = [];
        this.inputNomeTurma = null;
        this.inputDescricaoTurma = null;
    }

    desabilitarBotaoTerminar(status: number): boolean {
        return status != 2;
    }

    desabilitarCadastrar(): boolean {
        return !(this.inputNomeTurma != null && this.inputDescricaoTurma != null);
    }

    validacaoTurma(): boolean {
        let colaboradorCompetenciaMaterias: number[] = [];

        if (this.colaboradorCompetenciaHolder.length == 0) {
            return false;
        }

        this.colaboradorCompetenciaHolder.forEach((colaborador) => {
            if (colaborador.nivel == 3) {
                colaboradorCompetenciaMaterias.push(colaborador.competenciaId);
            }
        });

        if (colaboradorCompetenciaMaterias.length == 0) {
            return false;
        }

        this.colaboradorCompetenciaHolder.forEach((colaborador) => {
            if (((colaborador.nivel != 3) && (colaboradorCompetenciaMaterias.indexOf(colaborador.competenciaId) == -1))) {
                return false;
            }
        });
        return true;
    }

    desabilitarCadastrarIniciando(statusId: number) {
        if (statusId == 3 || statusId == 2) {
            return true;
        } else {
            if (!(this.desabilitarCadastrar()) && this.validacaoTurma()) {
                return false;
            }
        }
        return true;
    }

    desabilitarInputCompetencia(valor: string): boolean {
        return valor == null || valor == '';
    }

    desabilitarBotaoColaboradorCompetencia(valor: number): boolean {
        return valor != 1;
    }

    desabilitarBotaoColaboradorCompetenciaAlt(valor: number, nivelColaborador: number): boolean {
        if (this.desabilitarPorTurmaFinalizada(valor)) {
            return true;
        }
        if (valor == 2) {
            if (this.desabilitarPorTurmaIniciada(nivelColaborador)) {
                return true;
            }
        }
        return false;
    }

    desabilitarPorTurmaFinalizada(valor: number): boolean {
        return valor == 3;
    }

    desabilitarPorTurmaIniciada(nivelColaborador: number) {
        return nivelColaborador == 3;
    }

    desabilitarDeletarTurma(status: number): boolean {
        return status != 1;
    }

    desabilitarBotaoAdicionarColaborador(status: number) {
        return status == 3;
    }

    deletarColaboradorCompetenciaHolder(colaboradorSelecionado: TurmaColaboradorCompetenciaNivelModel) {
        this.colaboradorCompetenciaHolder.splice(this.colaboradorCompetenciaHolder.findIndex((colaborador) => colaboradorSelecionado.colaboradorId === colaborador.colaboradorId && colaborador.competenciaId === colaboradorSelecionado.competenciaId), 1);
    }

    deletarColaboradorCompetenciaHolderAlt(colaboradorSelecionado: TurmaColaboradorCompetenciaNivelModel, turmaId: number) {
        colaboradorSelecionado.turmaId = turmaId;

        if (this.colaboradorCompetenciaHolder.findIndex((colaborador) => colaboradorSelecionado.colaboradorId === colaborador.colaboradorId &&
            colaborador.competenciaId === colaboradorSelecionado.competenciaId) != -1) {
            this.turmaFormacaoService.deletarTurmaColaboradorCompetencia(colaboradorSelecionado).subscribe();
        }
        this.colaboradorCompetenciaHolder.splice(this.colaboradorCompetenciaHolder.findIndex((colaborador) => colaboradorSelecionado.colaboradorId === colaborador.colaboradorId && colaborador.competenciaId === colaboradorSelecionado.competenciaId), 1);
    }

    exluirTurmaFormacao(id) {
        this.turmaFormacaoService.deleteTurmaFormacao(id).subscribe(
            () => {
                this.messageService.add({
                    severity: 'success', summary: 'Sucesso ao Excluir',
                    detail: 'A Turma de Formação foi Excluída com Sucesso!',
                })
                this.listarTurmas();
            },
            () => {
                this.messageService.add({
                    severity: 'error', summary: 'Ocorreu um Error ao Excluir a Turma de Formação',
                })
                this.listarTurmas();
            }
        );
    }

    confirmation(id) {
        this.confirmService.confirm(FuncoesUtil.createConfirmation('Tem certeza de que deseja prosseguir?', 'Confirmação',
            () => this.exluirTurmaFormacao(id), 'Sim', 'Não'));
    }
}
