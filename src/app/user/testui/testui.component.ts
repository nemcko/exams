import { Component, OnInit } from '@angular/core';
import { TextsService, CrudService, ICrudCmd } from '../../shared/services';
import { ApiModel } from "../../shared";
import * as textdata from './testui.component.json';

@Component({
  selector: 'testui',
  templateUrl: './testui.component.html',
  styleUrls: ['./testui.component.css']
})
export class TestuiComponent implements OnInit {
  labels = {};
  oid = 'testdata1';

  constructor(
    private _crud: CrudService,
    public texts: TextsService,
  ) {
    this.labels = texts.toObject(textdata);
  }

  ngOnInit() {
  }

  rowClick(rowEvent) {
    console.log(JSON.stringify(rowEvent.row));
  }

  rowDoubleClick(rowEvent) {
    alert(JSON.stringify(rowEvent.row));
  }

  msg(txt:string){
    alert(txt);
  }

}
