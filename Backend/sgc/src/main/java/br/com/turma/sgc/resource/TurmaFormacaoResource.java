package br.com.turma.sgc.resource;

import br.com.turma.sgc.domain.TurmaFormacao;
import br.com.turma.sgc.service.TurmaFormacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/turma-formacao")
@RequiredArgsConstructor
public class TurmaFormacaoResource {

    private final TurmaFormacaoService service;

    @GetMapping
    public ResponseEntity<List<TurmaFormacao>> procurarTodos(){
        return ResponseEntity.ok().body(service.procurarTodos());
    }

    @GetMapping(value = "/{id}")
    public ResponseEntity<TurmaFormacao> procurarPorId(@PathVariable int id){
        return ResponseEntity.ok().body(service.procurarPorId(id));
    }

    @PostMapping
    public ResponseEntity<TurmaFormacao> inserir(@RequestBody TurmaFormacao turma){
        return ResponseEntity.ok().body(service.inserir(turma));
    }

    @DeleteMapping(value = "/{id}")
    public ResponseEntity<Void> deletar(@PathVariable int id){
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping
    public ResponseEntity<TurmaFormacao> atualizar(@RequestBody TurmaFormacao turma){
        return ResponseEntity.ok().body(service.atualizar(turma));
    }

}
