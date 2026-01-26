import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContatoComponent {
  readonly submitting = signal(false);
  readonly successMsg = signal('');
  readonly errorMsg = signal('');

  private readonly http = inject(HttpClient);

  readonly contactForm = new FormGroup({
    nome: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
    assunto: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    mensagem: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
  });

  onSubmit(event: Event) {
    event.preventDefault();
    this.successMsg.set('');
    this.errorMsg.set('');

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.errorMsg.set('Por favor, preencha os campos obrigatórios.');
      return;
    }

    this.submitting.set(true);

    const payload = this.contactForm.getRawValue();

    this.http.post<{ ok: boolean; id?: string }>(
      '/.netlify/functions/contact',
      payload,
    ).subscribe({
      next: () => {
        this.successMsg.set('Mensagem enviada com sucesso! Vou te responder o quanto antes.');
        this.contactForm.reset({ nome: '', email: '', assunto: '', mensagem: '' });
        this.submitting.set(false);
      },
      error: (err: HttpErrorResponse) => {
        const serverMsg =
          err.error && typeof err.error === 'object' && 'error' in err.error
            ? String((err.error as { error?: unknown }).error)
            : null;

        this.errorMsg.set(serverMsg || 'Não foi possível enviar a mensagem agora. Tente novamente em instantes.');
        this.submitting.set(false);
      },
    });
  }

  get nome() { return this.contactForm.get('nome'); }
  get email() { return this.contactForm.get('email'); }
  get assunto() { return this.contactForm.get('assunto'); }
  get mensagem() { return this.contactForm.get('mensagem'); }
}
