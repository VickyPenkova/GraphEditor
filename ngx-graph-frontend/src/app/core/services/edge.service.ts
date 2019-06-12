import { Injectable } from '@angular/core';
import { Node, Edge } from '@swimlane/ngx-graph';
import { GraphService } from './graph.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EdgeService {

  private _addingEdge:boolean = false;
  private _sourceId: string = null;
  private _targetId: string = null;

  constructor(private graphService: GraphService) { }

  get addingEdge():boolean {
    return this._addingEdge;
  }

  toggleAddingEdge(): void {
    this._addingEdge = !this._addingEdge;
    if (!this._addingEdge) {
      this._reset();
    }
  }

  addNodeToEdge(id:string): void {
    let nextId = this.graphService.edges.length + 1;
    if (this._sourceId == null) {
      this._sourceId = id;
    } else if (this._sourceId == id) {
      this._sourceId = null;
    } else if (this._targetId == null) {
      this._targetId = id;
      
      let edge:Edge = {
        id: "edge" + (nextId).toString(),
        source: this._sourceId,
        target: this._targetId,
        data: {
          color: "#3E6158",
          stroke_width: 2,
          label: "Edge " + (nextId).toString()
        }
      }

      this.graphService.addEdge(edge);

      this._reset();
    }
  }

  private _reset():void {
    this._addingEdge = false;
    this._sourceId = null;
    this._targetId = null;
  }

}
