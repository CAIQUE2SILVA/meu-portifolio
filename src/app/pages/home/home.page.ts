import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonMenuButton,
  IonIcon,
  IonGrid,
  IonCard,
  IonCardContent,
  IonButton,
  IonAvatar,
  IonRow,
  IonCol,
  IonText,
  IonLabel
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  menuOutline,
  logoGithub,
  logoLinkedin,
  logoAngular,
  logoIonic,
  logoReact,
  logoWhatsapp,
  mailOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButtons,
    IonMenuButton,
    IonIcon,
    IonGrid,
    IonCard,
    IonCardContent,
    IonButton,
    IonAvatar,
    IonRow,
    IonCol,
    IonText,
    IonLabel,
    IonContent,
  ]
})
export class HomePage {
  constructor() {
    addIcons({
      menuOutline,
      logoGithub,
      logoLinkedin,
      logoAngular,
      logoIonic,
      logoReact,
      logoWhatsapp,
      mailOutline
    });
  }

  // Método para abrir WhatsApp
  abrirWhatsApp() {
    const numero = '5511956386749'; // Substitua pelo seu número
    const mensagem = 'Olá, vim pelo seu portfólio!';
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, '_blank');
  }

  // Método para enviar email
  enviarEmail() {
    window.location.href = 'mailto:caique2silva@gmail.com';
  }
}
