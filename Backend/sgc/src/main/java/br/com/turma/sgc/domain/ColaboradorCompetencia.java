package br.com.turma.sgc.domain;

import br.com.turma.sgc.domain.pk.ColaboradorCompetenciaPK;
import br.com.turma.sgc.domain.enums.NivelEnum;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Setter
@Table(name = "colaborador_competencia")
public class ColaboradorCompetencia implements Serializable {

    @EmbeddedId
    private ColaboradorCompetenciaPK id;

    @ManyToOne
    @MapsId("idColaborador")
    @JoinColumn(name = "id_colaborador")
    private Colaborador colaborador;

    @ManyToOne
    @MapsId("idCompetencia")
    @JoinColumn(name = "id_competencia")
    private Competencia competencia;

    @Enumerated(EnumType.ORDINAL)
    @Column(name = "nivel")
    private NivelEnum nivel;
}
