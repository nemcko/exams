export namespace ApiModel {
    export const ext_doc = '*.doc, *.pdf, *.jpg, *.jpeg, *.docx, *.xls, *.xlsx';
    export const ext_audio = '*.mp3';
    export const ext_video = '*.mp4';
    
    export interface ILogin {
        usr: string;
        pwd?: string;
        name?: string;
        token?: string;
        uid?: string;
    }
    export class Login implements ILogin {
        usr: string;
        pwd: string;
        name?: string;
        token?: string;
        uid?: string;
    }

    export interface IOlAddress {
        display_name: string;
        lon: number;
        lat: number;
        street?: string;
        house_number?: string;
        postcode: string;
        city: string;
        country: string;
        country_code: string;
    }

    export class OlAddress implements IOlAddress {
        display_name: string;
        lon: number;
        lat: number;
        street?: string;
        house_number?: string;
        postcode: string;
        city: string;
        country: string;
        country_code: string;
    }

    export interface IExaDial {
        id: string;
        name: string;
    }

    export interface IExaUser {
        usr: string;
        firstname?: string;
        lastname?: string;
        faceid?: string;
    }

    export interface IExaPlace extends IExaDial { }

    export interface IExaCompany extends IExaDial { }

    export interface IExaOffice extends IExaDial { }


    export interface IExaBase {
        id: string;
        state: string;
        exatype: string;
        exnum: string;
        lng: string;
        flyingrules?: string;
        applicant?: IExaUser;
        assignedby?: IExaUser;
        asslpes?: IExaUser;
        assigndt?: Date;
        lpereal?: IExaUser;
        realdt?: Date;
        lprreal?: IExaUser;
        lprrespon?: IExaUser;
        appreal?: IExaUser;
        apprespon?: IExaUser;
        userecnr?: string;
        usevidnr?: string;
        usedt?: Date;
        testdoc?: string;
        testaudio?: string;
        testvideo?: string;
        testdt?: Date;
        valexato?: Date;
    }

    export interface IExaLpe {
        id: string;
        lperespon?: IExaUser;
        planplace?: IExaPlace;
        lpeplaned?: IExaUser;
        planeddt?: Date;
        realplace?: IExaPlace;
        lpechngre?: string;
        lpechngredt?: Date;
        usetstnr?: string;
        userecnr?: string;
        usevidnr?: string;
        lperat1?: number;
        lpecom1?: string;
        lperat2?: number;
        lpecom2?: string;
        lperat3?: number;
        lpecom3?: string;
        lperat4?: number;
        lpecom4?: string;
        lperat5?: number;
        lpecom5?: string;
        lperate?: number;
        testdoc?: string;
        testaudio?: string;
        testvideo?: string;
        lpestadt?: Date;
        lpeenddt?: Date;
    }

    export interface IExaLpr {
        id: string;
        lprrespon?: IExaUser;
        lprplaned?: IExaUser;
        lprchngre?: string;
        lprrat1?: number;
        lprcom1?: string;
        lprrat2?: number;
        lprcom2?: string;
        lprrat3?: number;
        lprcom3?: string;
        lprrat4?: number;
        lprcom4?: string;
        lprrat5?: number;
        lprcom5?: string;
        lprrate?: number;
        lprstadt?: Date;
        lprenddt?: Date;
    }

    export interface IExaApp {
        id: string;
        apprespon?: IExaUser;
        appplaned?: IExaUser;
        appchngre?: string;
        apprat1?: number;
        appcom1?: string;
        apprat2?: number;
        appcom2?: string;
        apprat3?: number;
        appcom3?: string;
        apprat4?: number;
        appcom4?: string;
        apprat5?: number;
        appcom5?: string;
        apprate?: number;
        appstadt?: Date;
        appenddt?: Date;
    }

    export type CardData = IExaBase | IExaLpe | IExaLpr | IExaApp;

    export interface IExamination extends IExaBase, IExaLpe, IExaLpr, IExaApp {
        id: string;
        company?: IExaCompany;
        examrec?: string;
        ratrep?: string;
        finexam?: string;
        aviaauto?: IExaOffice;
        invoice?: string;
        regpayment?: number;
        certificate?: string;
        rectime?: Date;
    }


    // export interface IMockData {
    //     name: string;
    //     username: string;
    //     email: string;
    //     title: string;
    //     surname: string;
    //     company: string;
    //     street: string | number;
    //     zip: string | number;
    //     city: string | number;
    // }


    // export class MockData implements IMockData {
    //     name: string;
    //     username: string;
    //     email: string;
    //     title: string;
    //     surname: string;
    //     company: string;
    //     street: string | number;
    //     zip: string | number;
    //     city: string | number;
    // }

}






// export namespace ApiModel {
//     export interface iMockData {
//         name: string;
//         username: string;
//         email: string;
//         title: string;
//         surname: string;
//         company: string;
//         street: string | number;
//         zip: string | number;
//         city: string | number;
//     }


//     export interface iExaType {
//         exatype: string;
//         name: string;
//     }

//     export interface iUserLng {
//         id: number;
//         usr: string;
//         lng: string;
//         level: string;
//         rtf: boolean;
//     }

//     export interface iUserDoc {
//         id: number;
//         usr: string;
//         type: string;
//         name: string;
//         comment: string;
//         from: Date;
//         to: Date;
//     }

//     export interface iUsr {
//         usr: string;
//         firstname: string;
//         lastname: string;
//     }

//     export interface iUser {
//         id: number;
//         usr: string;
//         firstname: string;
//         lastname: string;
//         phone: string;
//         mobile: string;
//         email: string;
//         profession: string;
//         speaks: iUserLng[];
//         usrtypes: iExaType[];
//         userdoc: iUserDoc[];
//     }

//     export interface iExam {
//         id: number;
//         isActive: boolean;
//     }

//     //id, usr, exacode, exnum, lng, usetstnr, userecnr, usevidnr, planplace, realplace, validto, invoice, payment, idcomp, examlevel, examrec, ratrep, rectime, gencert, idfly, cusr, cdat, ldusr, ldat
// }

// /* 
// // using the interfaces
// export class MyComponent {
//     cust: ApiModel.Customer; 
// } 
// */