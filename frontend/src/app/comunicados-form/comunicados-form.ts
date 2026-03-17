import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComunicadosService } from '../comunicados/comunicados.service';

@Component({
  selector: 'app-comunicados-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './comunicados-form.html',
})
export class ComunicadosForm {
  titulo = '';
  descricao = '';
  data = '';

  @Output() criado = new EventEmitter<void>(); // 👈 novo

  constructor(private service: ComunicadosService) {}

  submit() {
    const payload = {
      titulo: this.titulo,
      descricao: this.descricao,
      data: this.data,
    };

    this.service.createComunicado(payload).subscribe({
      next: () => {
        // limpa formulário
        this.titulo = '';
        this.descricao = '';
        this.data = '';

        // 🔥 avisa o componente pai
        this.criado.emit();
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
