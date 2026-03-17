import { Component } from '@angular/core';
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

  constructor(private service: ComunicadosService) {}

  submit() {
    const payload = {
      titulo: this.titulo,
      descricao: this.descricao,
      data: this.data,
    };

    this.service.createComunicado(payload).subscribe({
      next: () => {
        console.log('Criado com sucesso');

        // limpa formulário
        this.titulo = '';
        this.descricao = '';
        this.data = '';
      },
      error: (err) => {
        console.error(err);
      },
    });
  }
}
