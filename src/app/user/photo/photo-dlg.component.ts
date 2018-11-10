import { Component, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs';
import { Http, Headers, Request, Response, RequestOptions } from '@angular/http';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { NgbModalConfig, NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { UserService } from '../../user';
import { TextsService, BrwService, ICrudCmd, ICrudExec } from '../../shared/services';
import * as textdata from './photo.component.json';
import * as panelbuttons from '../../panelbuttons.json';

import { WebcamImage } from "../../shared/components/webcam/domain/webcam-image";
import { WebcamUtil } from "../../shared/components/webcam/util/webcam.util";
import { WebcamInitError } from "../../shared/components/webcam/domain/webcam-init-error";


@Component({
  template: `
  <pgaddlg [title]="labels.title + ' ('+user+')'">

    <div class="mb-2" style="height:365px;">
      <webcam [height]="naturalHeight" [width]="naturalWidth" [trigger]="triggerObservable" (imageCapture)="handleImage($event)" *ngIf="showWebcam"
              [allowCameraSwitch]="allowCameraSwitch" [switchCamera]="nextWebcamObservable"
              [videoOptions]="videoOptions"
              (cameraSwitched)="cameraWasSwitched($event)"
              (initError)="handleInitError($event)"
      ></webcam>
      <input type="file" accept="image/*" class="invisible" #photoInput (change)="handleInputChange($event)" style="width:10px;" />
      <button type=" button" class="btn btn-primary float-right" (click)="triggerSnapshot()">
        <span [class]="'fa fa-camera'"></span>&nbsp;&nbsp;{{labels.btnPhoto}}
      </button>
      <button type=" button" class="btn btn-primary float-right mr-2" (click)="photoInput.click()">
        <span [class]="'fa fa-folder-open'"></span>&nbsp;&nbsp;{{labels.btnUpload}}
      </button>
      <button type=" button" class="btn btn-primary float-right mr-2" (click)="deletePhoto()">
        <span [class]="'fa fa-trash'"></span>&nbsp;&nbsp;{{labels.btndelete}}
      </button>
   </div>

  </pgaddlg>
  `
})
export class PhotoDlgComponent {
  private _item;
  private _uuid: string;
  private _refrUuid: string;
  public labels = {};
  public oid = 'picture';
  public access: {};
  protected submitted = false;


  public get user() {
    return this._item.usr;
  }

  public naturalWidth: number = 450;
  public naturalHeight: number = 450;

  constructor(
    private _user: UserService,
    private _service: BrwService,
    public texts: TextsService,
    public activeModal: NgbActiveModal,
    private _modalService: NgbModal,
    private _http: Http
  ) {
    this.labels = texts.toObject([textdata, panelbuttons], _user.lng);
    this.access = _user.getAccess();
    this._uuid = this._refrUuid = this._service.getUUID(this.oid);
  }

  private _parent: any;
  public lodaData(item, parent, uuid = '') {
    this._parent = parent;
    this._refrUuid = (uuid ? uuid : this._uuid);
    this._item = item;
  }

  handleInputChange(event) {
    let self = this;
    let image = event.target.files[0];
    let pattern = /image-*/;

    if (!image.type.match(pattern)) {
      console.error('File is not an image');
      return;
    }

    let canvas = document.createElement('canvas');
    let img = new Image;
    img.src = URL.createObjectURL(image);
    img.onload = function () {
      canvas.width = img.width;
      canvas.height = img.height;  
      canvas.getContext('2d').drawImage(img, 0, 0);
      self.storeData(canvas.toDataURL(image.type));
    }
  }


  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: string;
  public videoOptions: MediaTrackConstraints = {  };
  public errors: WebcamInitError[] = [];

  public webcamImage: WebcamImage = null;

  private trigger: Subject<void> = new Subject<void>();
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();

  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      });
  }

  public triggerSnapshot(): void {
    this.trigger.next();
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    this.nextWebcam.next(directionOrDeviceId);
  }

  public handleImage(webcamImage: WebcamImage): void {
    console.info("received webcam image", webcamImage);
    this.webcamImage = webcamImage;
    this.storeData(webcamImage.imageAsDataUrl);
  }

  public cameraWasSwitched(deviceId: string): void {
    console.log("active device: " + deviceId);
    this.deviceId = deviceId;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  public storeData(data: string) {
    this._service.cmd(Object.assign({}, { oid: this.oid, cid: 'photo' }), { id: this._item.id, data: data }).subscribe(
      body => {
        this._parent.refresh();
        this._user.showToast({ type: 'success', message: this.labels['uploadSuccess'] });
        this.activeModal.close('Close click')
      },
      err => {
        this._user.showToast({ type: 'error', message: this.labels['uploadError'] });
        this.activeModal.close('Close click')
      }
    )
  }

  public deletePhoto() {
    this._service.cmd(Object.assign({}, { oid: this.oid, cid: 'delphoto' }), { id: this._item.id }).subscribe(
      body => {
        this._parent.refresh();
        this._user.showToast({ type: 'success', message: this.labels['deleteSuccess'] });
        this.activeModal.close('Close click')
      },
      err => {
        this._user.showToast({ type: 'error', message: this.labels['deleteError'] });
        this.activeModal.close('Close click')
      }
    )
  }

}
