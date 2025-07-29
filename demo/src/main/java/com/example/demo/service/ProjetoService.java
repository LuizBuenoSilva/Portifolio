package com.example.demo.service;

import com.example.demo.model.Projeto;
import com.example.demo.repository.ProjetoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProjetoService {

    private final ProjetoRepository projetoRepository;

    public ProjetoService(ProjetoRepository projetoRepository) {
        this.projetoRepository = projetoRepository;
    }

    public List<Projeto> listarTodos() {
        return projetoRepository.findAll();
    }

    public Projeto salvar(Projeto projeto) {
        return projetoRepository.save(projeto);
    }

    public void deletar(Long id) {
        projetoRepository.deleteById(id);
    }
}
