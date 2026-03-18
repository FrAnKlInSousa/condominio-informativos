import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComunicadosService } from './comunicados.service';
import { Comunicado } from '../models/comunicado';
import { ChangeDetectorRef } from '@angular/core';
import { ComunicadosForm } from '../comunicados-form/comunicados-form';
import { FormsModule } from '@angular/forms';

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

  constructor(
    private service: ComunicadosService,
    private cdr: ChangeDetectorRef,
  ) {}
  deletar(id: number) {
    this.service.deleteComunicado(id).subscribe({
      next: () => {
        this.loadComunicados();
      },
      error: (err) => console.error(err),
    });
  }

  comunicadoSelecionado: Comunicado | null = null;

  editar(c: Comunicado) {
    this.comunicadoSelecionado = c;
  }

  filtrar() {
    this.service.getComunicadosFiltrados(this.search, this.dataFiltro).subscribe({
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
  }

  loadComunicados() {
    this.service.getComunicados().subscribe({
      next: (data) => {
        this.comunicados = data;
        this.cdr.detectChanges(); // mantém por enquanto
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
