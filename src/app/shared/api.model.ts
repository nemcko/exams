export namespace ApiModel {
    export interface ILogin {
        usr: string;
        pwd?: string;
        name?: string;
        token?: string;
        uid?: string;
    }
    export class Login implements ILogin {
        usr: string;
        pwd?: string;
        name?: string;
        token?: string;
        uid?: string;
    }

    export interface IMockData {
        name: string;
        username: string;
        email: string;
        title: string;
        surname: string;
        company: string;
        street: string | number;
        zip: string | number;
        city: string | number;
    }


    export class MockData implements IMockData {
        name: string;
        username: string;
        email: string;
        title: string;
        surname: string;
        company: string;
        street: string | number;
        zip: string | number;
        city: string | number;
    }

}