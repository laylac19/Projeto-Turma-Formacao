package br.com.turma.sgc.repository;

import br.com.turma.sgc.domain.TurmaFormacao;
import br.com.turma.sgc.service.dto.TurmaFormacaoDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TurmaFormacaoRepository extends JpaRepository<TurmaFormacao, Integer> {

    @Query(value = "select t from TurmaFormacao t where t.ativo = true")
    List<TurmaFormacao> buscarTurmasAtivas();

    //Query para pegar as turmas em andamento.(Mikael)
    @Query(value = "select t from TurmaFormacao t where t.status.id = 2")
    List<TurmaFormacao> buscarTurmaAndamento();

    //Query para pegar as turmas de determinado intervalo de tempo.
    @Query(value = "select t from TurmaFormacao t where :inicio <= t.inicio and t.termino <= :fim")
    List<TurmaFormacao> buscarTodasTurmasPorIntervalo(@Param("inicio") LocalDate inicio, @Param("fim") LocalDate fim);

    @Query(value = "select t from TurmaFormacao t where t.status.id = :idStatus")
    List<TurmaFormacao> procurarTodosPorIdStatus(@Param("idStatus") Integer idStatus);

    //Query para pegar as turmas finalizadas.(Layla)
    @Query(value = "select t from TurmaFormacao t where t.status.id = 3")
    List<TurmaFormacao> buscaTurmaFinalizada();

    @Modifying
    @Query(value = "update TurmaFormacao t set t.ativo = false where t.id = :id")
    void destivarTurma(@Param("id") Integer id);
}
