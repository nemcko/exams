import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'appfot',
  template: `
  <nav class="navbar navbar-dark bg-primary mt-5 fixed-bottom">
    <div class="navbar-expand m-auto navbar-text">
      Made with <i class="fa fa-heart"></i> by <a href="https://twitter.com/beeman_nl">beeman</a>
    </div>
  </nav>  `
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
