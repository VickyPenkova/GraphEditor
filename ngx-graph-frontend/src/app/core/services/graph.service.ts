import { Injectable } from '@angular/core';
import { Node, Edge } from '@swimlane/ngx-graph';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GraphService {

  private nodes: Node[] = [];
  private edges: Edge[] = [];

  private _nodesObservable: Subject<Node[]> = new Subject<Node[]> ();

  constructor() {}

  addNode(node:Node) : void {
    console.log("Pushing node: " + node)
    this.nodes.push(node);
    this._nodesObservable.next(this.nodes);
  }

  get nodesObservable(): Subject<Node[]> {
    return this._nodesObservable;
  }
}
