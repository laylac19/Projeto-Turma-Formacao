package br.com.turma.sgc.service;

import br.com.turma.sgc.domain.Competencia;
import br.com.turma.sgc.repository.CategoriaRepository;
import br.com.turma.sgc.repository.ColaboradorCompetenciaRepository;
import br.com.turma.sgc.repository.ColaboradorRepository;
import br.com.turma.sgc.repository.CompetenciaRepository;
import br.com.turma.sgc.repository.TurmaColaboradorCompetenciaRepository;
import br.com.turma.sgc.repository.TurmaFormacaoRepository;
import br.com.turma.sgc.service.dto.CadastrarCompetenciaDTO;
import br.com.turma.sgc.service.dto.CompetenciaDTO;
import br.com.turma.sgc.service.mapper.CompetenciaMapper;
import br.com.turma.sgc.service.resource.exception.RegraNegocioException;
import br.com.turma.sgc.utils.ConstantUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;


@Service
@RequiredArgsConstructor
public class CompetenciaService {

    private final CompetenciaRepository competenciaRepository;

    private final TurmaFormacaoRepository turmaFormacaoRepository;

    private final ColaboradorRepository colaboradorRepository;

    private final CategoriaRepository categoriaRepository;

    private final CompetenciaMapper competenciaMapper;

    private final ColaboradorCompetenciaRepository colaboradorCompetenciaRepository;

    private final TurmaColaboradorCompetenciaRepository turmaColaboradorCompetenciaRepository;

    public List<CompetenciaDTO> procurarTodos() {
        return competenciaMapper.toDto(competenciaRepository.findAll());
    }

    public CompetenciaDTO procurarPorId(Integer id) {
        return competenciaMapper.toDto(competenciaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Elemento não encontrado!")));
    }

    public CompetenciaDTO inserir(CompetenciaDTO competenciaDTO) {
        verificarNomeCompetencia(competenciaDTO);

        if(competenciaDTO.getDescricao().length() < 5)
            throw new RegraNegocioException(ConstantUtils.ERRO_DESCRICAO_INVALIDA);

        return competenciaMapper.toDto(competenciaRepository.save(competenciaMapper.toEntity(competenciaDTO)));
    }

    private void verificarNomeCompetencia(CompetenciaDTO competencia){
        if(competenciaRepository.buscarPorNome(competencia).isPresent()) {
            throw new RegraNegocioException(ConstantUtils.ERRO_NOME_INVALIDO);
        }
    }

    public CompetenciaDTO atualizar(CompetenciaDTO competenciaDTO) {
        if(!(competenciaRepository.findById(competenciaDTO.getId()).isPresent()))
            throw new NoSuchElementException(ConstantUtils.ERRO_ENCONTRAR_IDCOMPETENCIA);

        verificarNomeCompetencia(competenciaDTO);

        if(competenciaDTO.getDescricao().length() < 5)
            throw new RegraNegocioException(ConstantUtils.ERRO_DESCRICAO_INVALIDA);

        return competenciaMapper.toDto(competenciaRepository.save(competenciaMapper.toEntity(competenciaDTO)));
    }

//    public void deletar(@Valid Integer id) {
//        if(!(competenciaRepository.findById(id).isPresent()))
//            throw new RegraNegocioException(ConstantUtils.ERRO_ENCONTRAR_IDCOMPETENCIA);
//        competenciaRepository.deleteById(id);
//    }

    public List<CompetenciaDTO> buscarCompetenciasPorNivelEPorIdColaborador(Integer idColaborador, Integer idNivel) {
        List<Competencia> competencias = colaboradorCompetenciaRepository.buscarCompetenciasPorNivelEPorIdColaborador(idColaborador,idNivel);
        return competenciaMapper.toDto(competencias);
    }

    public List<CompetenciaDTO> buscaCompetenciaNivel(Integer idColaborador){
        return colaboradorCompetenciaRepository.buscaCompetenciaNivel(idColaborador);
    }

    public List<CompetenciaDTO> buscarCompetenciaPorIdCategoria(Integer idCategoria) {
        if (!(categoriaRepository.findById(idCategoria).isPresent()))
            throw new NoSuchElementException(ConstantUtils.ERRO_ENCONTRAR_IDCATEGORIA);
        return competenciaMapper.toDto(competenciaRepository.buscarCompetenciaPorIdCategoria(idCategoria));
    }

    public List<CompetenciaDTO> pegarTodasCompetenciasDoColaboradorNaTurma(Integer idTurma, Integer idColaborador){
        if(!(turmaFormacaoRepository.findById(idTurma).isPresent()))
            throw new NoSuchElementException(ConstantUtils.ERRO_ENCONTRAR_IDTURMA);

        if(!(colaboradorRepository.findById(idColaborador).isPresent()))
            throw new NoSuchElementException(ConstantUtils.ERRO_ENCONTRAR_IDCOLABORADOR);

        if(!(turmaColaboradorCompetenciaRepository.procurarPorIdColaboradorTurma(idTurma, idColaborador).isPresent()))
            throw new NoSuchElementException(ConstantUtils.ERRO_ENCONTRAR_IDCOLABORADOR);

        return competenciaMapper.toDto(turmaColaboradorCompetenciaRepository.pegarTodasCompetenciasDoColaboradorNaTurma(idTurma, idColaborador));

    }

    public List<CadastrarCompetenciaDTO> buscarCompetenciasDropdown(){
        return competenciaRepository.buscarCompetenciasDropdown();
    }
}
