import { InjectionToken } from '@angular/core';

export class IConfig {
    appName: string;
    webUrl: string;
    apiUri: string;
}
export const CONFIG: IConfig = {
    appName: 'Examinator',
    webUrl: 'http://localhost:4200',
    apiUri: 'http://mylocal:88/examinator/api/index.php'
    // webUrl: 'http://examinator.eurosoftware.sk',
    // apiUri: 'http://examinator.eurosoftware.sk/api/index.php'
}
export let APP_CONFIG = new InjectionToken<IConfig>("config");
