// src/app/components/projetos/projetos.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProjetoService } from '../../services/projeto.service';
import { Projeto } from '../../models/projeto.model';

@Component({
  selector: 'app-projetos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './projetos.component.html',
  styleUrls: ['./projetos.component.css']
})
export class ProjetosComponent implements OnInit {
  projetos: Projeto[] = [];

  novoProjeto: Projeto = {
    titulo: '',
    urlImagem: '',
    descricao: '',
    linkRepositorio: ''
  };

  constructor(private projetoService: ProjetoService) {}

  ngOnInit(): void {
    this.carregarProjetos();
  }

  carregarProjetos(): void {
    this.projetoService.listar().subscribe((res) => {
      this.projetos = res;
    });
  }

  salvarProjeto(): void {
    this.projetoService.salvar(this.novoProjeto).subscribe(() => {
      this.novoProjeto = { titulo: '', urlImagem: '', descricao: '', linkRepositorio: '' };
      this.carregarProjetos();
    });
  }
}
