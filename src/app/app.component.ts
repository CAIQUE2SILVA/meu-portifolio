import { Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { WebMcpService } from './core/webmcp/webmcp.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [
    RouterOutlet,
  ],
  standalone: true,
})
export class AppComponent implements OnDestroy {
  private readonly webMcp = inject(WebMcpService);

  constructor() {
    this.webMcp.registerTools();
  }

  ngOnDestroy(): void {
    this.webMcp.unregisterTools();
  }
}
