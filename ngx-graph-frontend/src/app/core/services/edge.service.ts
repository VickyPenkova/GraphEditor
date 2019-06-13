import { Injectable } from '@angular/core';
import { Node, Edge } from '@swimlane/ngx-graph';
import { GraphService } from './graph.service';
import { Subject } from 'rxjs';
import { NodeService } from './node.service';

@Injectable({
  providedIn: 'root'
})
export class EdgeService {

  private _addingEdge:boolean = false;
  private _sourceId: string = null;
  private _targetId: string = null;

  constructor(private graphService: GraphService,
              private nodeService: NodeService) { }

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
    let nextId = Math.floor(Math.random() * 1000000000);;
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
          label: "Edge"
        }
      }

      this.graphService.addEdge(edge);

      this._reset();
    }
  }

  private s:string;
  private h:string;
  private uuid:string;
  private potentialHtml:string;

  public addSource(label:string, uuid:string, hash:string, potentialHtml:string): void {
    this.s = label;
    this.h = hash;
    this.uuid = uuid;
    this.potentialHtml = potentialHtml;
  }

  public addTarget(targetId:string): void {
    let newNodeId = this.uuid;
    if(this.graphService.getNodeById(this.uuid) != null){
      if(this.graphService.edgeExistsBetween(this.uuid, targetId)) {
        return
      }
    } else{
      let newNodeId: string = this.nodeService.addLinkedNode(this.s, this.uuid);
    } 

    let nextId = Math.floor(Math.random() * 1000000000);
    let edge:Edge = {
      id: "edge" + (nextId).toString(),
      source: newNodeId,
      target: targetId,
      data: {
        color: "#3E6158",
        stroke_width: 2,
        label: "Edge"
      }
    }

    this.graphService.addEdge(edge);
    this.graphService.updateFile(this.h, this.potentialHtml);
  }

  private _reset():void {
    this._addingEdge = false;
    this._sourceId = null;
    this._targetId = null;
  }

}
