package com.example.demo.model;

import jakarta.persistence.*;

@Entity
public class Projeto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String titulo;
    private String descricao;
    private String urlImagem;
    private String linkRepositorio;

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitulo() { return titulo; }
    public void setTitulo(String titulo) { this.titulo = titulo; }

    public String getDescricao() { return descricao; }
    public void setDescricao(String descricao) { this.descricao = descricao; }

    public String getUrlImagem() { return urlImagem; }
    public void setUrlImagem(String urlImagem) { this.urlImagem = urlImagem; }

    public String getLinkRepositorio() { return linkRepositorio; }
    public void setLinkRepositorio(String linkRepositorio) { this.linkRepositorio = linkRepositorio; }
}
