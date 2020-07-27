import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardorder'
})
export class CardorderPipe implements PipeTransform {

  transform(value: any, args?: any): Object[] {
    let keyArr: any[] = Object.keys(value),
      dataArr = [],
      keyName = args;

    keyArr.forEach((key: any) => {
      // value[key][keyName] = key;
      // dataArr.push(value[key])
      value[key]['cardcode'] = key;
      dataArr.unshift(value[key])
    });

    dataArr.sort((a: Object, b: Object): number => {
      return a[keyName] > b[keyName] ? 1 : -1;
    });

    return dataArr;
  }
}
