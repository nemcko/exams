import { Component } from '@angular/core';
import { UserService } from './user.service'
import { TextsService, CrudService, ICrudCmd } from '../shared/services';
import { ApiModel } from "../shared";
import * as textdata from './user.component.json';

@Component({
  template: `
  <router-outlet></router-outlet>
  `
})
export class UserComponent {
  labels = {};

  constructor(
    private _crud: CrudService,
    private _user: UserService,
    public texts: TextsService,
  ) {
    this.labels = texts.toObject(textdata,_user.lng);
  }

}

// <pgtitle [title]="labels.title" [subtitle]="labels.name">
  
// <div class="btn-group" role="group" aria-label="Basic example">
//     <a routerLink="" type="button" class="btn btn-outline-secondary"><i class="fa fa-home"></i> Users</a>
//     <a routerLink="testui" type="button" class="btn btn-outline-secondary"><i class="fa fa-user"></i> Test</a>
// </div>
// </pgtitle>

