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

  private searchSubject = new Subject<void>();

  constructor(
    private service: ComunicadosService,
    private cdr: ChangeDetectorRef,
  ) {}

  deletar(id: number) {
    if (this.deletandoIds.has(id)) return; // 👈 trava clique duplo

    const confirmar = confirm('Tem certeza que deseja deletar?');
    if (!confirmar) return;

    this.deletandoIds.add(id);

    this.service.deleteComunicado(id).subscribe({
      next: () => {
        this.loadComunicados();
        this.mostrarMensagem('Comunicado deletado');
        this.deletandoIds.delete(id);
      },
      error: (err) => {
        console.error(err);
        this.deletandoIds.delete(id);
      },
    });
  }

  comunicadoSelecionado: Comunicado | null = null;

  editar(c: Comunicado) {
    this.comunicadoSelecionado = c;
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
}
