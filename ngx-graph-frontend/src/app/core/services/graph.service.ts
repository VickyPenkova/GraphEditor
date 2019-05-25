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
  private _edgesObservable: Subject<Edge[]> = new Subject<Edge[]> ();

  constructor() {}

  addNode(node:Node) : void {
    console.log("Pushing node: " + node)
    this.nodes.push(node);
    this._nodesObservable.next(this.nodes);
  }

  addEdge(edge:Edge) : void {
    if(this.edgeExists(edge)) {
      console.log("Edge: " + edge + " already exists.");
      return
    }

    console.log("Pushing edge: " + edge);
    this.edges.push(edge);
    this._edgesObservable.next(this.edges);
  }

  deleteNode(node):void {
    this.nodes = this.nodes.filter(n => n !== node);
    this.deleteAllEdgesOfNode(node.id);
    this._nodesObservable.next(this.nodes);
  }

  deleteAllEdgesOfNode(node_id:string) {
    this.edges
      .filter(e => e.source == node_id || e.target == node_id)
      .forEach(e => this.deleteEdge(e));
  }

  deleteEdge(edge):void {
    this.edges = this.edges.filter(e => e !== edge);
    this._edgesObservable.next(this.edges);
  }

  private edgeExists(edge: Edge) : boolean {
    for(let e of this.edges) {
      if(e.source == edge.source
        && e.target == edge.target) {
        return true;
      }
    }
    return false;
  }

  getNodeById(id:string) {
    for(let node of this.nodes) {
      if(node.id == id) {
        return node;
      }
    }
    return null;
  }

  getEdgeById(id:string) {
    for(let edge of this.edges) {
      if(edge.id == id) {
        return edge;
      }
    }
    return null;
  }

  updateNodeById(id:string, node:Node) {
    for(let node of this.nodes) {
      if(node.id == id) {
        node = node;
      }
    }
    this._nodesObservable.next(this.nodes);
  }

  updateEdgeById(id:string, node:Edge) {
    for(let edge of this.edges) {
      if(edge.id == id) {
        edge = edge;
      }
    }
    this._edgesObservable.next(this.edges);
  }

  get nodesObservable(): Subject<Node[]> {
    return this._nodesObservable;
  }

  get edgesObservable(): Subject<Edge[]> {
    return this._edgesObservable;
  }
}
