package br.com.turma.sgc.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public enum NivelEnum {

    NIVEL1(1, "Júnior"),
    NIVEL2(2, "Pleno"),
    NIVEL3(3, "Sênior).");

    private Integer id;
    private String nome;
}
