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
  loadComunicados() {
    this.service.getComunicados().subscribe((data) => {
      this.comunicados = data;
    });
  }
  constructor(
    private service: ComunicadosService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.service.getComunicados().subscribe({
      next: (data) => {
        console.log('dados:', data);
        this.comunicados = data;
        this.cdr.detectChanges(); // 👈 ESSENCIAL
        this.loadComunicados();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
