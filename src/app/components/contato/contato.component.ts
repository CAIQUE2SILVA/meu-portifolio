import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.scss'
})
export class ContatoComponent {
  submitting = signal(false);
  successMsg = signal('');
  errorMsg = signal('');

  form = {
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  };

  async onSubmit(event: Event) {
    event.preventDefault();
    this.successMsg.set('');
    this.errorMsg.set('');
    this.submitting.set(true);

    try {
      const resp = await fetch('/.netlify/functions/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.form),
      });

      if (!resp.ok) {
        const data = await resp.json().catch(() => null);
        throw new Error((data && data.error) || 'Não foi possível enviar a mensagem.');
      }

      this.successMsg.set('Mensagem enviada com sucesso! Entrarei em contato em breve.');
      this.form = { nome: '', email: '', assunto: '', mensagem: '' };

      setTimeout(() => this.successMsg.set(''), 5000);
    } catch (err) {
      this.errorMsg.set(err instanceof Error ? err.message : 'Erro ao enviar a mensagem.');
      setTimeout(() => this.errorMsg.set(''), 8000);
    } finally {
      this.submitting.set(false);
    }
  }

}
