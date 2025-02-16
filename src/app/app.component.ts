import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonHeader, IonMenu, IonContent, IonLabel, IonItem, IonList, IonTitle, IonIcon, IonToolbar } from '@ionic/angular/standalone';
import { MenuComponent } from './shared/components/menu/menu.component';
import { addIcons } from 'ionicons';
import { homeOutline, personOutline, briefcaseOutline, mailOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    IonHeader,
    IonApp,
    IonRouterOutlet,
    MenuComponent,
    IonMenu,
    IonContent,
    IonLabel,
    IonItem,
    IonList,
    IonTitle,
    IonToolbar,
    IonIcon
  ],
  standalone: true,
})
export class AppComponent {
  constructor() {
    addIcons({
      homeOutline,
      personOutline,
      briefcaseOutline,
      mailOutline
    });
  }
}
