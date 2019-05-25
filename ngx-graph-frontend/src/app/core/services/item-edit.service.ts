import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemEditService {

  private _multipleEditors: boolean = false;
  private _itemsOpenForEditting: any[] = [];
  private _itemsOpenForEdittingObservable: Subject<any> = new Subject<any>();

  constructor() { }

  get observeItemsOpenForEditting(): Subject<Node[]> {
    return this._itemsOpenForEdittingObservable;
  }

  openItemForEditting(item) : void {
    if (this._itemsOpenForEditting.indexOf(item) > -1) {
      console.log("Item: " + item + " already open for editting.")
      return;
    }

    console.log("Opening item for editting: " + item)
    this._itemsOpenForEditting.push(item);

    if(this._multipleEditors) {
      this._itemsOpenForEdittingObservable.next(this._itemsOpenForEditting);
    } else {
      this.closeUnneededEditors();
    }
  }

  closeItemForEditting(item:any) : void {
    this._itemsOpenForEditting = this._itemsOpenForEditting.filter(i => i !== item);
    this._itemsOpenForEdittingObservable.next(this._itemsOpenForEditting);
  }

  set multipleEditors(enabled:boolean) {
      this._multipleEditors = enabled;

      if (!enabled) {
        this.closeUnneededEditors();
      }
  }

  private closeUnneededEditors(): void {
    if (this._itemsOpenForEditting.length == 0) {
      return;
    }
    this._itemsOpenForEditting = [this._itemsOpenForEditting[this._itemsOpenForEditting.length - 1]];
    this._itemsOpenForEdittingObservable.next(this._itemsOpenForEditting);
  }
}
