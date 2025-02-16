import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonMenuButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonIcon,
  IonImg, IonAvatar } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  codeOutline,
  phonePortraitOutline,
  serverOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-sobre',
  templateUrl: './sobre.page.html',
  styleUrls: ['./sobre.page.scss'],
  standalone: true,
  imports: [IonAvatar,
    CommonModule,
    IonContent,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonButtons,
    IonMenuButton,
    IonGrid,
    IonRow,
    IonCol,
    IonCard,
    IonCardContent,
    IonIcon,
    IonImg
  ]
})
export class SobrePage {
  constructor() {
    addIcons({
      codeOutline,
      phonePortraitOutline,
      serverOutline
    });
  }
}
