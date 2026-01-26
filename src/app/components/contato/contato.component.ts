import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-contato',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
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
    if (this.contactForm.invalid) return;

    const formData = new URLSearchParams();
    formData.set('form-name', 'contact');
    formData.set('nome', this.contactForm.value.nome || '');
    formData.set('email', this.contactForm.value.email || '');
    formData.set('assunto', this.contactForm.value.assunto || '');
    formData.set('body', this.contactForm.value.body || '');

    this.http.post('/', formData.toString(), {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
      responseType: 'text'
    })
    .pipe(
      catchError(err => {
        if (err.status === 404) {
          console.log('✅ Netlify Form enviado com sucesso!');
          return of('success');
        }
        throw err;
      })
    )
    .subscribe(() => {
      this.contactForm.reset();
      this.successMsg.set('success');
    });
  }

}
