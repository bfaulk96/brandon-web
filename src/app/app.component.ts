import {Component, OnInit} from '@angular/core';
import * as Particles from "particlesjs/dist/particles.js"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  name = 'Brandon Faulkner';

  ngOnInit() {
    Particles.init({
      selector: '.background',
      connectParticles: true,
      color: ['#2ab816', '#797979', '#252A3D'],
      responsive: [
        {
          breakpoint: 768,
          options: {
            maxParticles: 70,
          }
        }, {
          breakpoint: 425,
          options: {
            maxParticles: 50,
          }
        }, {
          breakpoint: 320,
          options: {
            maxParticles: 0
          }
        }
      ]
    });
  }

  getYear() {
    return new Date().getFullYear()
  }
}
