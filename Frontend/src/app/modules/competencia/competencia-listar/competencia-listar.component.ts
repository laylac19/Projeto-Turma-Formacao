import { CategoriaService } from './../service/categoria.service';
import { Component, OnInit } from '@angular/core';

import { CompetenciaService } from '../service/competencia.service';
import { CompetenciaModel } from '../models/competencia.model';

const URL_COMPETENCIA:string = 'competencia';
@Component({
  selector: 'app-competencia-listar',
  templateUrl: './competencia-listar.component.html',
  styleUrls: ['./competencia-listar.component.scss']
})
export class CompetenciaListarComponent implements OnInit {

    competenciasTotal:CompetenciaModel[] = [];
    competenciasFiltrada: CompetenciaModel[] = [];
    display: boolean = false;
    displayEdit:boolean = false;
    competenciaDetalhada: CompetenciaModel;
    competenciaEditada: CompetenciaModel;

  constructor(private competenciaService: CompetenciaService) {}

  ngOnInit(): void {
    this.listarCompetencias();
  }


  listarCompetencias(){
    this.competenciaService.obterTodasCompetenciasComURL(URL_COMPETENCIA).subscribe(competencias => {
        this.competenciasTotal = competencias;
        this.competenciasFiltrada = competencias;
    })
  }

  obterCompetencias(filtro){

    console.log(filtro);
    if(filtro == undefined || filtro.trim() == ''){
        this.competenciasFiltrada = this.competenciasTotal;
        return;
    }

    this.competenciasFiltrada = this.competenciasTotal.filter((competencia) =>
        competencia.nome.toLowerCase().indexOf(filtro.toLowerCase()) >= 0 || competencia.id === Number(filtro));

  }

  showDialog(competencia: CompetenciaModel){
        console.log(competencia);
        this.competenciaDetalhada = competencia;
        this.display = true;
  }

  showDialogEdit(){
      this.competenciaEditada = this.competenciaDetalhada;
      this.display = false;
      this.displayEdit = true;
  }

  getCompetenciaDetalhada():CompetenciaModel{
    return this.competenciaDetalhada;
  }


}
