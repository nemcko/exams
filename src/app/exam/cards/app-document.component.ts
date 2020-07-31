import { Component, Input, Output, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { UploadEvent, UploadFile, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';

import { ApiService } from '../../shared/services';
import { UserService } from '../../user';
import { TextsService, BrwService, ICrudCmd } from '../../shared/services';
import { ApiModel } from "../../shared";
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';


@Component({
  selector: 'appdoc',
  templateUrl: './app-document.component.html'
})
export class AppDocumentComponent implements OnInit {
  protected submitted = false;
  public isNew = true;
  public oid = 'appdoc';
  public access: {};
  public disabledrop: boolean = false;

  @Input('type') public doctype: string = '';
  @Input() public examid: string;
  @Input('form') public dataForm: FormGroup;
  @Input('lbl') public labels: any;
  @Input() public name: string;

  constructor(
    private _api: ApiService,
    private _user: UserService,
    private _service: BrwService,
  ) { }

  ngOnInit() {
  }


  // public get docUri(): string {
  //   return `appdocument/${this._api.docId(this.examid)}`;
  // }

  ngOnDestroy() {
  }

  public get availExt(): string {
    switch (this.doctype) {
      case 'testdoc':
      case 'showdoc':
      case 'mediadoc':
        return ApiModel.ext_doc;
      case 'testaudio':
      case 'showaudio':
      case 'mediaaudio':
        return ApiModel.ext_audio;
      case 'testvideo':
      case 'showvideo':
      case 'mediavideo':
        return ApiModel.ext_video;
      default: return '';
    }
  }

  public get docUri(): string {
    switch (this.doctype) {
      case 'testdoc':
      case 'showdoc':
        return 'testdoc';
      case 'testaudio':
      case 'showaudio':
        return 'testaudio';
      case 'testvideo':
      case 'showvideo':
        return 'testvideo';
      case 'mediadoc':
      case 'mediaaudio':
      case 'mediavideo':
        return 'mediafile';
      default: return '';
    }
  }

  public files: UploadFile[] = [];
  public dropped(event: UploadEvent) {
    this.files = event.files;
    for (const droppedFile of event.files) {

      // filename.split('.').pop()


      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          let foundext = false;
          let ext = droppedFile.relativePath.split('.').pop().toLowerCase();
          this.availExt.split(',').map(e => {
            if (e.trim().replace('*.', '') == ext) {
              foundext = true;
            }
          });
          if (!foundext) {
            this._user.showToast({ type: 'error', message: this.labels['badextension'] });
            return;
          };

          const formData = new FormData()
          formData.append('filedata', file, droppedFile.relativePath);
          formData.append('type', this.docUri);
          // formData.append('name', droppedFile.relativePath);

          this._api.postData(`appdocument/${this._api.docId(this.examid)}`, formData)
            .subscribe(data => {
              this.dataForm.patchValue({ [this.docUri]: droppedFile.relativePath });
            })
          return;
        });
      }
    }
  }

  public fileOver(event) {
    // console.log(event);

  }

  public fileLeave(event) {
    // console.log(event);
  }

  public doClick(event) {
    let docurl = this._api.getApiUrl(`appdocument/${this._api.docId(this.examid)}/${this.doctype.replace('show', 'test')}/${encodeURI(this.name)}`);
    this.showDocument(docurl);
  }

  public doMediaClick(event) {
    let docurl = this._api.getApiUrl(`appdocument/${this._api.docId(this.examid,'MD')}/${this.docUri}/${encodeURI(this.name)}`);
    this.showDocument(docurl);
  }

  protected showDocument(docurl: string) {
    switch (this.doctype) {
      case 'showdoc':
      case 'mediadoc': {
        let win = window.open('', this.doctype);
        win.document.write(`
          <body marginheight="0" marginwidth="0">
            <iframe src="http://docs.google.com/gview?url=${docurl}&embedded=true" width="100%" height="100%" style="border: none;">
            </iframe>
          </body>
      `);
      } break;
      // return window.open(`http://docs.google.com/gview?url=${docurl}&embedded=true`, this.doctype);
      case 'mediaaudio':
      case 'showaudio': {
        let win = window.open('', this.doctype);
        win.document.write(`
        <audio src="${docurl}" controls>
          Your browser does not support the audio element.
          <a href="${docurl}">Download file</a>.</p>
        </audio>
      `);
      }
        break;
      case 'mediavideo':
      case 'showvideo': {
        let win = window.open('', this.doctype);
        win.document.write(`
        <video width="320" height="240" controls>
          <source src="${docurl}" type="video/mp4">      
          <p>Your browser does not support the video tag.
          <a href="${docurl}">Download file</a>.</p>
        </video>
      `);
      }
        break;
      default:
        let win = window.open('', this.doctype);
        win.document.write(`
        <object data="${docurl}" type="application/pdf" width="100%" height="100%">
          <iframe src="${docurl}" width="100%" height="100%" style="border: none;">
              <p>Your browser does not support PDFs.
              <a href="${docurl}">Download file</a>.</p>
          </iframe>
        </object>
      `);
    }

  }


}

/*
<object data="document.xls" type="application/vnd.ms-excel">
You don't have an plugin for Excel documents.
<a href="document.xls">Download the file</a>.
</object>

<object width="775px" height="500px" classid="clsid:00020906-0000-0000-C000-000000000046" data="sampleword.doc"></object>
<object width="775px" height="500px" classid="clsid:000209FF-0000-0000-C000-000000000046">
  <param name="filename" value="sampleword.doc">
</object>

<body style="margin:0px;padding:0px;overflow:hidden">
    <iframe src="embed url" frameborder="0" style="overflow:hidden;overflow-x:hidden;overflow-y:hidden;height:100%;width:100%;position:absolute;top:0px;left:0px;right:0px;bottom:0px" height="100%" width="100%"></iframe>
</body>


header("Content-Type: application/force-download");
    header("Content-type: application/pdf");
    header("Content-Disposition: inline; filename=\"".$name."\";");
-------------------------
$extension = pathinfo($file_name, PATHINFO_EXTENSION);
$url = 'uploads/'.$file_name;
        echo '<html>'
                .header('Content-Type: application/'.$extension).'<br>'
                .header('Content-Disposition: inline; filename="'.$file_name.'"').'<br>'
                .'<body>'
                .'<object   style="overflow: hidden; height: 100%;
             width: 100%; position: absolute;" height="100%" width="100%" data="'.$url.'" type="application/'.$extension.'">
                    <embed src="'.$url.'" type="application/'.$extension.'" />
             </object>'
            .'</body>'
            . '</html>';
-----------------------------------------
    if(preg_match("/\.jpg|\.gif|\.png|\.jpeg/i", $name)){
            $mime = getimagesize($download_location);
            if(!empty($mime)) {
                header("Content-Type: {$mime['mime']}");
            }
        }
        elseif(preg_match("/\.pdf/i", $name)){
            header("Content-Type: application/force-download");
            header("Content-type: application/pdf");
            header("Content-Disposition: inline; filename=\"".$name."\";");
        }

        else{
            header("Content-Type: application/force-download");
            header("Content-type: application/octet-stream");
            header("Content-Disposition: attachment; filename=\"".$name."\";");
        }
----------------------------------------------
var myWin = window.open(strUrl, strWindowName);
 let link = `${_spPageContextInfo.webAbsoluteUrl}/SiteAssets/Pages/help.aspx#/help`;
    window.open(link, "_blank");

 <a href="https://www.google.co.in/" target="blank">click Here </a>

 <a href="http://chriscoyier.net" onclick="window.open(this.href); return false;" onkeypress="window.open(this.href); return false;">This link will open in new window/tab</a>


text/plain
text/html
text/javascript
text/css
image/jpeg
image/png
audio/mpeg
audio/ogg
audio/*
video/mp4
application/*
application/json
application/ecmascript
application/octet-stream

application/javascript
application/ecmascript
application/x-ecmascript
application/x-javascript
text/ecmascript
text/javascript1.0
text/javascript1.1
text/javascript1.2
text/javascript1.3
text/javascript1.4
text/javascript1.5
text/jscript
text/livescript
text/x-ecmascript
text/x-javascript

image/gif	GIF images (lossless compression, superseded by PNG)
image/jpeg	JPEG images
image/png	PNG images
image/svg+xml	SVG images (vector images)
image/x-icon, image/vnd.microsoft.icon

audio/wave
audio/wav
audio/x-wav
audio/x-pn-wav	An audio file in the WAVE container format. The PCM audio codec (WAVE codec "1") is often supported, but other codecs have limited support (if any).
audio/webm	An audio file in the WebM container format. Vorbis and Opus are the most common audio codecs.
video/webm	A video file, possibly with audio, in the WebM container format. VP8 and VP9 are the most common video codecs; Vorbis and Opus the most common audio codecs.
audio/ogg	An audio file in the OGG container format. Vorbis is the most common audio codec used in such a container.
video/ogg	A video file, possibly with audio, in the OGG container format. Theora is the usual video codec used within it; Vorbis is the usual audio codec.
application/ogg








*/