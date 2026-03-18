import { Component, EventEmitter, Output, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComunicadosService } from '../comunicados/comunicados.service';

@Component({
  selector: 'app-comunicados-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './comunicados-form.html',
})
export class ComunicadosForm implements OnChanges {
  titulo = '';
  descricao = '';
  data = '';

  @Input() comunicado: any;
  @Output() criado = new EventEmitter<void>();

  constructor(private service: ComunicadosService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['comunicado']) {
      if (this.comunicado) {
        this.titulo = this.comunicado.titulo;
        this.descricao = this.comunicado.descricao;
        this.data = this.comunicado.data?.substring(0, 10);
      } else {
        this.resetForm(); // 👈 ESSA LINHA resolve seu problema
      }
    }
  }

  submit() {
    const payload = {
      titulo: this.titulo,
      descricao: this.descricao,
      data: this.data,
    };

    if (this.comunicado?.id) {
      this.service.updateComunicado(this.comunicado.id, payload).subscribe({
        next: () => {
          this.resetForm();
          this.criado.emit();
        },
        error: (err) => console.error(err),
      });
    } else {
      this.service.createComunicado(payload).subscribe({
        next: () => {
          this.resetForm();
          this.criado.emit();
        },
        error: (err) => console.error(err),
      });
    }
  }

  resetForm() {
    this.titulo = '';
    this.descricao = '';
    this.data = '';
  }
}
