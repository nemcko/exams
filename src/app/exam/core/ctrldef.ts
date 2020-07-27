import { Type } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { ApiModel } from '../../shared/api.model';

export interface IExaCardCmd {
    code: string;
    data?: any;
}

export interface IExaCardButtons {
    close?: boolean;
    btnCancel?: boolean;
    btnBack?: boolean;
    btnsave?: boolean;
    btnsaveexit?: boolean;
    btnsavenext?: boolean;
}

export interface IExaControl {
    cardOrder: number;
    component: Type<any>;
    nextcard?: string;
    cardcode?: string;
    objLbl?: any;
    labels?: any;
    access?: any;
    data?: ApiModel.CardData;
    getData?: () => any;
    isValid?: (usrsvc) => boolean;
    parentCtrl?: any,
    fb?: FormBuilder,
    cmdsub?: any;
    doCommand?(cmd: IExaCardCmd | [IExaCardCmd]): void;
    onCommand?(): Observable<IExaCardCmd>;
}

export interface IExaCtrl {
    cardcode?: string;
    objLbl?: any;
    labels?: any;
    access?: any;
    data?: ApiModel.CardData;
    getData?: () => any;
    isValid?: (usrsvc) => boolean;
    parentCtrl?: any,
    fb?: FormBuilder,
    cmdsub?: any;
    doCommand?(cmd: IExaCardCmd | [IExaCardCmd]): void;
    onCommand?(): Observable<IExaCardCmd>;
}

export class ExaCtrl implements IExaControl {
    constructor(
        public cardOrder: number,
        public component: Type<any>,
        public nextcard?: string,
        public cardcode?: string,
        public objLbl?: any,
        public labels?: any,
        public access?: any,
        public parentCtrl?: any,
        public data?: ApiModel.CardData,
        public getData?: () => any,
        public isValid?: (usrsvc) => boolean,
        public fb?: FormBuilder,
        public cmdsub?: any,
    ) { }

    // public doCommand(cmd: IExaCardCmd) {
    //     this.cmdsub.next(cmd);
    // }

    // public clearCommends() {
    //     this.cmdsub.next();
    // }

    // public getCommand(): Observable<IExaCardCmd> {
    //     return this.cmdsub.asObservable();
    // }

}

export interface IExamination {
    [code: string]: IExaControl
}

export interface IExaCtrlListItem {
    code: string; ctrl: IExaControl;
}

export interface ExaCtrlList extends Array<IExaCtrlListItem> { };