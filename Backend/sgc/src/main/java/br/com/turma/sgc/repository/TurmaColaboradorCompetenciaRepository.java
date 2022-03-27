package br.com.turma.sgc.repository;

import br.com.turma.sgc.domain.Colaborador;
import br.com.turma.sgc.domain.ColaboradorCompetencia;
import br.com.turma.sgc.domain.Competencia;
import br.com.turma.sgc.domain.TurmaColaboradorCompetencia;
import br.com.turma.sgc.domain.pk.TurmaColaboradorCompetenciaPK;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TurmaColaboradorCompetenciaRepository extends JpaRepository<TurmaColaboradorCompetencia, TurmaColaboradorCompetenciaPK> {

    @Query("select tcc from TurmaColaboradorCompetencia tcc inner join ColaboradorCompetencia cc" +
            " on cc.nivel < 3 and cc.colaborador.id = tcc.colaborador.id where tcc.turma.id = :idTurma")
    List<TurmaColaboradorCompetencia> procurarTodosAlunosPorIdTurma(@Param("idTurma") Integer id);

    @Query("select tcc from TurmaColaboradorCompetencia tcc inner join ColaboradorCompetencia cc" +
            " on cc.nivel = 3 and cc.colaborador.id = tcc.colaborador.id where tcc.turma.id = :idTurma")
    List<TurmaColaboradorCompetencia> procurarTodosInstrutoresPorIdTurma(@Param("idTurma") Integer id);

    @Query(value = "select tcc.competencia from TurmaColaboradorCompetencia tcc " +
            "where tcc.turma.id = :idTurma and tcc.colaborador.id = :idColaborador")
    List<Competencia> pegarTodasCompetenciasDoColaboradorNaTurma(@Param("idTurma") Integer idTurma,
                                                                 @Param("idColaborador") Integer idColaborador);

    @Query(value = "select tcc from TurmaColaboradorCompetencia tcc " +
            "where tcc.colaborador.id = :idColaborador and tcc.turma.id = :idTurma")
    Optional<TurmaColaboradorCompetencia> procurarPorIdColaboradorTurma(@Param("idTurma") Integer idTurma,
                                                                        @Param("idColaborador") Integer idColaborador);

    @Query(value = "select cc from ColaboradorCompetencia cc inner join TurmaColaboradorCompetencia tcc on cc.colaborador.id = tcc.colaborador.id" +
            " and cc.competencia.id = tcc.competencia.id where tcc.turma.id  = :idTurma")
    List<ColaboradorCompetencia> procurarColaboradorCompetenciaPorTurma(@Param("idTurma") Integer id);

    @Query("select tcc.colaborador from  ColaboradorCompetencia cc inner join TurmaColaboradorCompetencia tcc " +
            " on cc.colaborador.id = tcc.colaborador.id where tcc.colaborador.id = cc.colaborador.id and tcc.turma.status.id = 2")
    List<Colaborador> procurarInstrutoresEmTurma();
}
