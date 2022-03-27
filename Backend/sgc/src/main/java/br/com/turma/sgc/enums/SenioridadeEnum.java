package br.com.turma.sgc.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public enum SenioridadeEnum implements Serializable {

    ESTAGIARIO(1, "Estagiário"),
    JUNIOR(2, "Júnior"),
    PLENO(3, "Pleno"),
    SENIOR(4, "Sênior");

    private int id;
    private String nome;
}
