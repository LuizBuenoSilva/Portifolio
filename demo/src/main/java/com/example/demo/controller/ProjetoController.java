package com.example.demo.controller;

import com.example.demo.model.Projeto;
import com.example.demo.service.ProjetoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projetos")
@CrossOrigin(origins = "*") // para permitir requisições do Angular
public class ProjetoController {

    private final ProjetoService projetoService;

    public ProjetoController(ProjetoService projetoService) {
        this.projetoService = projetoService;
    }

    @GetMapping
    public List<Projeto> listarTodos() {
        return projetoService.listarTodos();
    }

    @PostMapping
    public Projeto salvar(@RequestBody Projeto projeto) {
        return projetoService.salvar(projeto);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        projetoService.deletar(id);
    }
}
