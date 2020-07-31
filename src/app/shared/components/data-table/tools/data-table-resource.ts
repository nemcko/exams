import { DataTableParams } from '../components/types';
import { CrudService } from '../../../../shared/services';


export class DataTableResource<T> {
    private items: T[];

    constructor(private _crud: CrudService,private oid:string) { }

    query(params: DataTableParams, filter?: (item: T, index: number, items: T[]) => boolean): Promise<T[]> {
        return new Promise((resolve, reject) => {
            let result: T[] = [];
            this._crud.query(params)
                .subscribe(
                    body => {
                        // setTimeout(() => {
                        this.items = this._crud.getReceivedData<T>(body);
                        result = this.items;
                        // }, 10000);

                    },
                    err => {
                        if (err.status === 408) {
                            // this._appsvc.logInMe();
                            // this._appsvc.showSnackbar(err._body);
                        } else {
                            // this._appsvc.showSnackbar(err);
                        }
                    },
                    () => {
                        // if (filter) {
                        //     result = this.items.filter(filter);
                        // } 
                        // if (params.sortBy) {
                        //     result.sort((a, b) => {
                        //         if (typeof a[params.sortBy] === 'string') {
                        //             return a[params.sortBy].localeCompare(b[params.sortBy]);
                        //         } else {
                        //             return a[params.sortBy] - b[params.sortBy];
                        //         }
                        //     });
                        //     if (params.sortAsc === false) {
                        //         result.reverse();
                        //     }
                        // }
                        // if (params.offset !== undefined) {
                        //     if (params.limit === undefined) {
                        //         result = result.slice(params.offset, result.length);
                        //     } else {
                        //         result = result.slice(params.offset, params.offset + params.limit);
                        //     }
                        // }
                        resolve(result);
                    }
                )
        });
    }

    requery( filter?: (item: T, index: number, items: T[]) => boolean): Promise<T[]> {
        return this.query({oid: this.oid},filter);
    }

    count(): Promise<number> {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(this.items ? this.items.length : 0));
        });

    }
}
