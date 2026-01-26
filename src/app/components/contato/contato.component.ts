import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders, provideHttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';

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
    const formData = { ...this.contactForm.value, 'form-name': 'contact' };
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'text/html'
    });
    this.http.post('/', new URLSearchParams(formData as Record<string, string>).toString(), {
      headers, responseType: 'text'
    }).subscribe(() => this.submitted.set(true));
  }

  get name() { return this.contactForm.get('name'); }
  get email() { return this.contactForm.get('email'); }
  get body() { return this.contactForm.get('body'); }
}
