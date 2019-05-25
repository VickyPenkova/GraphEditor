import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Node } from '@swimlane/ngx-graph';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private _multipleEditors: boolean = false;
  private _nodesOpenForEditting: Node[] = [];
  private _nodesOpenForEdittingObservable: Subject<Node[]> = new Subject<Node[]> ();

  constructor() { }

  get observeNodesOpenForEditting(): Subject<Node[]> {
    return this._nodesOpenForEdittingObservable;
  }

  openNodeForEditting(node:Node) : void {
    if (this._nodesOpenForEditting.indexOf(node) > -1) {
      console.log("Node: " + node + " already open for editting.")
      return;
    }

    console.log("Opening node for editting: " + node)
    this._nodesOpenForEditting.push(node);

    if(this._multipleEditors) {
      this._nodesOpenForEdittingObservable.next(this._nodesOpenForEditting);
    } else {
      this.closeUnneededEditors();
    }
  }

  set multipleEditors(enabled:boolean) {
      this._multipleEditors = enabled;

      if (!enabled) {
        this.closeUnneededEditors();
      }
  }

  private closeUnneededEditors(): void {
    this._nodesOpenForEditting = [this._nodesOpenForEditting[this._nodesOpenForEditting.length - 1]];
    this._nodesOpenForEdittingObservable.next(this._nodesOpenForEditting);
  }
}
