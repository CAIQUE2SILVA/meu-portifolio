import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, provideHttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [HttpClient],
  templateUrl: './contato.component.html',
  styleUrl: './contato.component.scss'
})
export class ContatoComponent {
  successMsg = signal('');
  errorMsg = signal('');
  submitted = signal(false);

  constructor(private http: HttpClient) {}

  contactForm = new FormGroup({
    nome: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    assunto: new FormControl('', Validators.required),
    body: new FormControl('', Validators.required)
  });


  onSubmit(event: Event) {
    event.preventDefault();
    const formData = new URLSearchParams();
    formData.set('form-name', 'contact');
    formData.set('nome', this.contactForm.value.nome || '');
    formData.set('email', this.contactForm.value.email || '');
    formData.set('assunto', this.contactForm.value.assunto || '');
    formData.set('body', this.contactForm.value.body || '');

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.http.post('/', formData.toString(), { headers, responseType: 'text' })
    .pipe(catchError((err) => {
      if (err.status === 404) {
        console.log('✅ Netlify Form enviado com sucesso!');
        return of('success');
      }
      throw err;
    }))
    .subscribe(() => {
      this.submitted.set(true);
      this.contactForm.reset();
    });
  }
}
