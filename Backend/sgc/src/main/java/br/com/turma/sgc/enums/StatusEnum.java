package br.com.turma.sgc.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Getter
public enum StatusEnum {

    PENDENTE(1, "Pendente"),
    INICIADA(2, "Iniciada"),
    CONCLUIDA(3, "Concluída");

    private int id;
    private String nome;
}
