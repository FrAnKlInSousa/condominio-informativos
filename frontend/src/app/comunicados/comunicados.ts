import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComunicadosService } from './comunicados.service';
import { Comunicado } from '../models/comunicado';
import { ChangeDetectorRef } from '@angular/core';
import { ComunicadosForm } from '../comunicados-form/comunicados-form';

@Component({
  selector: 'app-comunicados',
  standalone: true,
  imports: [CommonModule, ComunicadosForm],
  templateUrl: './comunicados.html',
  styleUrl: './comunicados.css',
})
export class Comunicados implements OnInit {
  comunicados: Comunicado[] = [];

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

  ngOnInit(): void {
    this.loadComunicados();
  }

  loadComunicados() {
    this.service.getComunicados().subscribe({
      next: (data) => {
        console.log('reload:', data);
        this.comunicados = data;
        this.cdr.detectChanges(); // mantém por enquanto
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
