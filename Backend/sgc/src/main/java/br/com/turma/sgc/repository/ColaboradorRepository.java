package br.com.turma.sgc.repository;

import br.com.turma.sgc.domain.Colaborador;
import br.com.turma.sgc.service.dto.ColaboradorListDTO;
import br.com.turma.sgc.service.dto.CompetenciaColaboradorDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ColaboradorRepository extends JpaRepository<Colaborador, Integer> {

    @Query("select new br.com.turma.sgc.service.dto.CompetenciaColaboradorDTO(nome, sobrenome) " +
            "from Colaborador " +
            "where id = :id")
    CompetenciaColaboradorDTO buscarColaborador(@Param("id") Integer id);

    @Query("select new br.com.turma.sgc.service.dto.ColaboradorListDTO(id, nome, sobrenome, senioridade.nome) " +
            " from Colaborador where  ativo = true ")
    List<ColaboradorListDTO> obterTodos();

    @Query("select c from Colaborador c where c.cpf = :cpf")
    Colaborador buscarPorCPF(@Param("cpf") String cpf);

    @Query("select c from Colaborador c where c.email = :email")
    Optional<Colaborador> buscarPorEmail(@Param("email") String email);

    @Modifying
    @Query(value = "update Colaborador c set c.ativo = false where c.id = :colaboradorId")
    void destativarColaborador(@Param("colaboradorId") Integer colaboradorId);

}
