import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';
import { inject } from '@angular/core';
import { FormBuilder, } from '@angular/forms';
import {  throwError } from 'rxjs';


@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.scss'
})
export class ContatoComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  successMsg = signal('');
  errorMsg = signal('');

  contactForm: FormGroup = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    assunto: ['', Validators.required],
    body: ['', Validators.required],
  });


  onSubmit(event: Event) {
    event.preventDefault();

    if (this.contactForm.invalid) {
      this.errorMsg.set('Preencha todos os campos corretamente.');
      return;
    }

    const formData = new URLSearchParams();
    formData.set('form-name', 'contact'); // MESMO nome do index.html
    formData.set('nome', this.contactForm.value.nome);
    formData.set('email', this.contactForm.value.email);
    formData.set('assunto', this.contactForm.value.assunto);
    formData.set('body', this.contactForm.value.body);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.http.post('/', formData.toString(), {
      headers,
      responseType: 'text'
    })
    .pipe(
      catchError(err => {
        // Se o Netlify tratou o form mas devolveu 404 / HTML
        if (err.status === 404) {
          console.log('✅ Netlify Form enviado com sucesso!');
          this.successMsg.set( 'Mensagem enviada com sucesso!');
          this.errorMsg.set('');
          this.contactForm.reset();
          return of('success');
        }
        this.errorMsg.set('Falha ao enviar mensagem. Tente novamente.');
        this.successMsg.set('');
        return throwError(() => err);
      })
    )
    .subscribe(() => {
      // Caso venha 200/204, também trata como sucesso
      this.successMsg.set('Mensagem enviada com sucesso!');
      this.errorMsg.set('');
      this.contactForm.reset();
    });
  }

}




