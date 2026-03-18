import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComunicadosService } from './comunicados.service';
import { Comunicado } from '../models/comunicado';
import { ChangeDetectorRef } from '@angular/core';
import { ComunicadosForm } from '../comunicados-form/comunicados-form';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-comunicados',
  standalone: true,
  imports: [CommonModule, ComunicadosForm, FormsModule],
  templateUrl: './comunicados.html',
  styleUrl: './comunicados.css',
})
export class Comunicados implements OnInit {
  comunicados: Comunicado[] = [];
  search = '';
  dataFiltro = '';
  mensagem = '';
  mostrarToast = false;
  paginaAtual = 1;
  limite = 5;
  deletandoIds = new Set<number>();
  confirmandoDeleteId: number | null = null;

  private searchSubject = new Subject<void>();

  constructor(
    private service: ComunicadosService,
    private cdr: ChangeDetectorRef,
  ) {}

  deletar(id: number) {
    // 👇 primeiro clique só ativa confirmação
    if (this.confirmandoDeleteId !== id) {
      this.confirmandoDeleteId = id;
      return;
    }

    // 👇 evita múltiplos cliques durante request
    if (this.deletandoIds.has(id)) return;

    this.deletandoIds.add(id);

    this.service.deleteComunicado(id).subscribe({
      next: () => {
        this.loadComunicados();
        this.mostrarMensagem('Comunicado deletado');

        this.deletandoIds.delete(id);
        this.confirmandoDeleteId = null;
      },
      error: (err) => {
        console.error(err);
        this.deletandoIds.delete(id);
        this.confirmandoDeleteId = null;
      },
    });
  }

  comunicadoSelecionado: Comunicado | null = null;

  editar(c: Comunicado) {
    this.comunicadoSelecionado = c;

    // 👇 espera o Angular renderizar e então faz scroll
    setTimeout(() => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }, 0);
  }

  filtrar() {
    this.service
      .getComunicadosFiltrados(this.search, this.dataFiltro, this.paginaAtual, this.limite)
      .subscribe({
        next: (data) => {
          this.comunicados = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err),
      });
  }

  limparFiltro() {
    this.search = '';
    this.dataFiltro = '';
    this.loadComunicados();
  }

  ngOnInit(): void {
    this.loadComunicados();
    this.searchSubject.pipe(debounceTime(700)).subscribe(() => {
      this.filtrar();
    });
  }

  loadComunicados() {
    this.service
      .getComunicadosFiltrados(this.search, this.dataFiltro, this.paginaAtual, this.limite)
      .subscribe({
        next: (data) => {
          this.comunicados = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error(err),
      });
  }

  onSearchChange() {
    this.searchSubject.next();
  }

  cancelarEdicao() {
    this.comunicadoSelecionado = null;
  }

  private timeoutId: any;

  mostrarMensagem(texto: string) {
    this.mensagem = texto;
    this.mostrarToast = true;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.mostrarToast = false;
      this.cdr.detectChanges();
    }, 1500);
  }

  onCriado() {
    this.loadComunicados();

    if (this.comunicadoSelecionado) {
      this.mostrarMensagem('Comunicado atualizado');
    } else {
      this.mostrarMensagem('Comunicado criado');
    }

    this.comunicadoSelecionado = null;
  }

  proximaPagina() {
    this.paginaAtual++;
    this.loadComunicados();
  }

  paginaAnterior() {
    if (this.paginaAtual > 1) {
      this.paginaAtual--;
      this.loadComunicados();
    }
  }

  cancelarDelete() {
    this.confirmandoDeleteId = null;
  }
}
