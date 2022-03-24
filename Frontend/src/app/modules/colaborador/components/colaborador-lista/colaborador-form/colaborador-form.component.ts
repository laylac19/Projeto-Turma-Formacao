import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService, SelectItem } from 'primeng/api';
import { CadastrarCompetenciaModel } from 'src/app/modules/competencia/models/cadastro-competencia.model';
import { CompetenciaService } from 'src/app/modules/competencia/service/competencia.service';
import { SenioridadeModel } from 'src/app/shared/model/senioridade.model';
import { CadastrarColaboradorModel } from '../../../models/cadastro-colaborador.model';
import { ColaboradorService } from '../../../service/colaborador.service';
import {FileUpload} from "primeng";
import {CompetenciaModel} from "../../../../competencia/models/competencia.model";

@Component({
  selector: 'app-colaborador-form',
  templateUrl: './colaborador-form.component.html',
  styleUrls: ['./colaborador-form.component.scss']
})
export class ColaboradorFormComponent implements OnInit {
  @Output() atualizaListaColaborador: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('upload') uploadImg: FileUpload;

  file: FileReader = new FileReader();

  colaborador: CadastrarColaboradorModel;

  formBuilder: FormBuilder = new FormBuilder();

  formGroup: FormGroup;

  image;

  listaCompetencia: Array<CadastrarCompetenciaModel> = [];

  listaCompetenciaSelecionado: Array<CadastrarCompetenciaModel> = [];

  listaSenioridade: Array<SenioridadeModel> = [];

  dropdownCompetencia: SelectItem[];

  dropdownNivel: SelectItem[] = [
    { value: 1, label: "Júnior" },
    { value: 2, label: "Pleno" },
    { value: 3, label: "Sênior" }
  ];

  competenciaId: number;
  nivelId: number;
  display: boolean = false;


  dropdownSenioridade: SelectItem[];

  constructor(private _colaboradorService: ColaboradorService,
    private _competenciaService: CompetenciaService,
    private _messageService: MessageService,
    private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
    this.buscarCompetencia();
    this.criarFormulario();

    this.criaDropdownSenioridade();

  }

  salvarColaborador(): void {
    if (!this.colaborador) {
      this.inserirColaborador();
      return;
    }
      this.atualizarColaborador();
  }


  buscarColaboradorPorId(id: number): void {
    this._colaboradorService.buscarColaboradorPorId(id).subscribe(
      res => {
        this.colaborador = res;
        this.criarFormulario();
        this.formGroup.patchValue(res);
        this.formGroup.get('dataNascimento').setValue(this.convertStringDate(res.dataNascimento.toString()));
        this.formGroup.get('dataAdmissao').setValue(this.convertStringDate(res.dataAdmissao.toString()));
        this.listaCompetenciaSelecionado = res.competencia;
        this.image = this.sanitizer.bypassSecurityTrustUrl('data:image/ext;base64,' + res.foto);
      },
      err => console.error(err)
    );
  }

  limparFormulario(): void {
    this.colaborador = null;
    this.criarFormulario();
    this.listaCompetenciaSelecionado = [];
    this.image = null;
    this.competenciaId = null;
    this.nivelId = null;
    this.file = new FileReader();
    this.uploadImg.clear();
  }

  adicionarListaCompetencia(): void {
      const competencias: CadastrarCompetenciaModel[] = this.formGroup.get("competencia").value;

    const itemCompetencia = this.dropdownCompetencia.find(item => item.value == this.competenciaId);
    const nomeCompetencia = !!itemCompetencia ? itemCompetencia.label : "";
      if(competencias.find(value => value.id == itemCompetencia.value)) {
          this._messageService.add({
              severity: 'error', summary: 'Competencia já cadastrada nesse colaborador',
          })
          return;
      }
    this.listaCompetenciaSelecionado.push(new CadastrarCompetenciaModel(this.competenciaId, nomeCompetencia, this.nivelId))
  }

  public uploadImagem(event): void {
    this.image = event.currentFiles[0].objectURL;
    this.file.readAsBinaryString(event.currentFiles[0]);
    this.file.onload = () => this.converterArquivo()
  }

  public converterArquivo(): void {
    this.formGroup.get('foto').setValue(btoa(this.file.result.toString()));
  }

  public criaDropdownSenioridade(): void {
    this.listaSenioridade = JSON.parse(localStorage.getItem('senioridade'));

    this.dropdownSenioridade = this.listaSenioridade.map(
      item => ({
        label: item.descricao,
        value: item.id,
        items: []
      })
    )

  }

  convertStringDate(strDate: string): Date {
    if (!strDate) { return null; }
    const splittedDate = strDate.split('-').map(e => +e);
    return new Date(splittedDate[0], splittedDate[1] - 1, splittedDate[2]);
  }

  public inserirColaborador(): void {
    this.formGroup.get('competencia').setValue(this.listaCompetenciaSelecionado);

    this.colaborador = this.formGroup.getRawValue();

    this._colaboradorService.inserir(this.colaborador).subscribe(
      res => {
        this._messageService.add({
          severity: 'success', summary: 'Sucesso ao Inserir',
          detail: 'O Colaborador e suas Competências foram inseridos com sucesso!'
        });
        this.atualizaListaColaborador.emit(true);
      },
      err => {
        this._messageService.add({
          severity: 'error', summary: 'Ocorreu um error na Inclusão',
          detail: err.error.ERRORS
        })
          this.colaborador = null;
      },
    )

  }

  public atualizarColaborador(): void {
    this.formGroup.get('competencia').setValue(this.listaCompetenciaSelecionado);

    this.colaborador = this.formGroup.getRawValue();

    this._colaboradorService.atualizar(this.colaborador).subscribe(
      res => {
        this._messageService.add({
          severity: 'success', summary: 'Sucesso ao Alterar',
          detail: 'O Colaborador e suas Competências foram alterados com sucesso!'
        });
        this.atualizaListaColaborador.emit(true);
      },
      err => {
        this._messageService.add({
          severity: 'error', summary: 'Ocorreu um error na Alteração',
          detail: err.error.ERRORS
        })
      },
    )

  }

  public buscarCompetencia(): void {
    this._competenciaService.obterCompetenciasDropdown('competencia').subscribe(
      res => {
        this.listaCompetencia = res
        this.dropdownCompetencia = res.map(
          item => ({
            label: item.nome,
            value: item.id
          })
        )
      },
      err => {
        this._messageService.add({
          severity: 'error', summary: 'Ocorreu um error na busca',
          detail: 'Error ao buscar!'
        })
      }
    )
  }

  excluirCompetencia(competenciaId): void {
    this.listaCompetenciaSelecionado = this.listaCompetenciaSelecionado.filter(item => item.id != competenciaId)
  }

  obterDescricaoNivel(nivel) {
    const itemNivel = this.dropdownNivel.find(item => item.value == nivel);
    return !!itemNivel ? itemNivel.label : "";
  }

  public criarFormulario(): void {
    this.formGroup = this.formBuilder.group({
      id: [0],

      nome: ['', [Validators.required]],

      sobrenome: ['', [Validators.required]],

      cpf: ['', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]],

      email: ['', [Validators.required, Validators.email]],

      dataNascimento: ['', [Validators.required]],

      dataAdmissao: ['', [Validators.required]],

      idSenioridade: [null, [Validators.required]],

      competencia: [[]],

      foto: ['']

    })
  }
}
