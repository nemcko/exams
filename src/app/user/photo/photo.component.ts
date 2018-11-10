import { Component, Inject, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { StateService } from '../../shared/services/state.service';
import { IConfig, APP_CONFIG } from '../../shared/config';

@Component({
  selector: 'usrphoto',
  template: `
  <style>
  .face {
    width: 48px;
    height: 48px;
    display: inline-block;
    border-radius: 50%;
  }
  </style>
  <img [src]="srcurl" class="face ml-2 mr-3">
`
})
export class PhotoComponent implements OnInit {
  @Input() uid: string;

  public srcurl: any  = 'assets/icons/unknown.png';

  constructor(
    @Inject(APP_CONFIG) public config: IConfig,
    protected http: HttpClient,
    protected sanitizer: DomSanitizer,
    public state: StateService,
  ) { }

  ngOnInit() {
    let url = `${this.config.apiUri}/images/${this.state.md5(this.uid)}/photo/thumb`;
    this.http.get(url, { responseType: 'blob' })
      .subscribe(resp => {
        if (resp.size) {
          let urlCreator = window.URL;
          this.srcurl = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(resp));
        }
      });
  }
}