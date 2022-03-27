package br.com.turma.sgc.repository;

import br.com.turma.sgc.domain.Competencia;
import br.com.turma.sgc.service.dto.CompetenciaDTO;
import br.com.turma.sgc.service.dto.CadastrarCompetenciaDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface CompetenciaRepository extends JpaRepository<Competencia, Integer> {

    @Query(value = "select c from Competencia c join Categoria ca on ca.id = :idCategoria")
    List<Competencia> buscarCompetenciaPorIdCategoria(@Param("idCategoria") Integer idCategoria);

    @Query(value = "select c from Competencia c where lower(c.nome) LIKE lower(:#{#competencia.nome})")
    Optional<Competencia> buscarPorNome(@Param("competencia") CompetenciaDTO competencia);

    @Query(value = "select c from Competencia c where c.ativo = true and lower(c.nome) LIKE lower(:#{#competencia.nome})")
    Optional<Competencia> buscarPorNomesAtivos(@Param("competencia") CompetenciaDTO competencia);

    @Query(value = "select new br.com.turma.sgc.service.dto.CadastrarCompetenciaDTO(c.id, c.nome) from Competencia c where c.ativo = true")
    List<CadastrarCompetenciaDTO> buscarCompetenciasDropdown();

    @Modifying
    @Query(value = "update Competencia c set c.ativo = false where c.id = :competenciaId")
    void desativarCompetencia(@Param("competenciaId")Integer competenciaId);

    @Query(value = "select c from Competencia c where c.ativo = true")
    List<Competencia> buscarCompetecniasAtivas();

}
