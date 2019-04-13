import {Component, OnInit} from '@angular/core';
import * as Particles from "particlesjs/dist/particles.js"

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  name = 'Brandon Faulkner';
  termName = 'brandon.faulkner$';
  bio = {
    "Degree": "BS Computer Science",
    "Occupation": "Application Software Developer",
    "Company": "Centene Corporation",
    "Experience": "3.5 years"
  };

  socialMedia = {
    "LinkedIn": {
      "name": "Brandon Faulkner",
      "link": "https://www.linkedin.com/in/brandon-faulkner-10836276/"
    },
    "GitHub": {
      "name": "bfaulk96",
      "link": "https://github.com/bfaulk96"
    },
    "Facebook": {
      "name": "Brandon Faulkner",
      "link": "https://www.facebook.com/monstro222"
    },
    "Twitter": {
      "name": "BFaulk96",
      "link": "https://twitter.com/BFaulk96"
    },
  };

  ngOnInit() {
    Particles.init({
      selector: '.background',
      connectParticles: true,
      color: ['#2ab816', '#797979', '#4186ff'],
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

  getKeys(object) {
    return Object.keys(object);
  }
}
