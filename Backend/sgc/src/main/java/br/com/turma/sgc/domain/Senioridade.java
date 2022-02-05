package br.com.turma.sgc.domain;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Getter
@Setter
@Table(name = "senioridade")
public class Senioridade implements Serializable {

    @Id
    private int id;

    @Column(name = "nome")
    private String nome;

}
