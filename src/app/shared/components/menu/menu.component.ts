import { Component } from '@angular/core';
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonHeader,
  IonMenu,
  IonToolbar,
  IonIcon,
  IonTitle,
  IonMenuButton,
  IonButtons
} from "@ionic/angular/standalone";
import { RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  homeOutline,
  personOutline,
  briefcaseOutline,
  mailOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonHeader,
    IonToolbar,
    IonIcon,
    IonTitle,
    IonMenu,
    IonMenuButton,
    IonButtons,
    RouterLink
  ],
})
export class MenuComponent {
  constructor() {
    addIcons({
      homeOutline,
      personOutline,
      briefcaseOutline,
      mailOutline
    });
  }
}
