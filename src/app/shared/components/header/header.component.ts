import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'apphdr',
  template: `
  <nav class="navbar navbar-dark bg-primary mb-5">
    <a class="navbar-brand" href="/">Angular & Bootstrap</a>
    <div class="navbar-expand mr-auto">
      <div class="navbar-nav">
        <a class="nav-item nav-link active" href="#">Home</a>
        <a class="nav-item nav-link" href="#">About</a>
        <a class="nav-item nav-link" href="#">Contact</a>
      </div>
    </div>
    <div class="navbar-expand ml-auto navbar-nav">
      <div class="navbar-nav">
        <a class="nav-item nav-link" href="https://github.com/beeman" target="_blank">
          <i class="fa fa-github"></i>
        </a>
        <a class="nav-item nav-link" href="https://twitter.com/beeman_nl" target="_blank">
          <i class="fa fa-twitter"></i>
        </a>
        <a class="nav-item nav-link" href="https://medium.com/@beeman" target="_blank">
          <i class="fa fa-medium"></i>
        </a>
      </div>
    </div>
  </nav>
 `
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
