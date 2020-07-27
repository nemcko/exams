import { Component, Inject, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { StateService } from '../../services';
import { IConfig, APP_CONFIG } from '../../config';

@Component({
  selector: 'face',
  template: `
  <img [src]="srcurl" [ngStyle]="{'display': 'inline-block','border-radius': '50%','width.px': size,'height.px': size}" [ngClass]="cls" [class.colorless]="readonly">
`
})
export class FaceComponent implements OnInit {
  @Input() set uid(val: string) {
    this.loadImage(val);
  }
  @Input() size: number = 48;
  @Input() cls: string = 'ml-2 mr-3';
  @Input() readonly: boolean = false;

  public srcurl: any = 'assets/icons/unknown.png';

  constructor(
    @Inject(APP_CONFIG) public config: IConfig,
    protected http: HttpClient,
    protected sanitizer: DomSanitizer,
    public state: StateService,
  ) { }

  ngOnInit() {
  }

  protected loadImage(uid: string = '') {
    let url = `${this.config.apiUri}/images/${this.state.md5(uid)}/photo/thumb`;
    this.http.get(url, { responseType: 'blob' })
      .subscribe(resp => {
        if (resp.size) {
          // let reader = new FileReader();
          // reader.addEventListener("load", () => {
          //   let urlCreator = window.URL;// || window.webkitURL;
          //   // this.srcurl = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(reader.result));
          //   this.srcurl = urlCreator.createObjectURL(reader.result);
          // }, false);

          // reader.readAsDataURL(resp);
          let urlCreator = window.URL;
          // this.srcurl = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(resp));
          this.srcurl = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(resp));
        }
      });

  }
}

// this.http.get(url, {   responseType: "blob" })
// .map((response: Response) => {
//   if (response) {
//     let urlCreator = window.URL;
//     this.srcurl = urlCreator.createObjectURL(response['blob']());
//   }
// }).subscribe();


  // public getUriFilename(str?: string): string {
  //   if (str && this.processed && str.lastIndexOf(".") >= 0) {
  //     str = str.substr(0, str.lastIndexOf(".")) + '-processed' + str.substr(str.lastIndexOf("."));
  //   }
  //   if (this.period) {
  //     let file: string = this.appsvc.apiUri + '/file/' + window.btoa(encodeURIComponent(str)) + '/' + encodeURIComponent(Date.now().toString())
  //     return (file ? file : 'assets/null.png');
  //   } else {
  //     return (str ? 'static/' + str : 'assets/null.png');
  //   }
  // }

