import { Injectable } from "@angular/core";
import { Node, Edge, Graph } from "@swimlane/ngx-graph";
import {Observable, Subject} from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {tap} from "rxjs/operators";

const httpOptions: object = {
  headers: new HttpHeaders({ "Content-Type": "application/json" })
};
const graphBackendUrl: string = "http://localhost:8090/api/v1/graphs";

export class GraphDTO {
  name: String;
  graph;

  constructor(name:String, nodes:Node[], edges:Edge[]) {
    this.name = name;
    this.graph = {
      "nodes": nodes,
      "edges": edges
    }
  }
};

@Injectable({
  providedIn: "root"
})
export class GraphService {

  private _graphs: GraphDTO[] = [new GraphDTO("WIP Graph",[],[])];
  private _currentGraph: number = 0;

  private _graphsObservable: Subject<GraphDTO[]> = new Subject<GraphDTO[]>();
  private _nodesObservable: Subject<Node[]> = new Subject<Node[]> ();
  private _edgesObservable: Subject<Edge[]> = new Subject<Edge[]> ();
  private _currentGraphObservable: Subject<number> = new Subject<number>();

  constructor(
      private http: HttpClient
  ) {
    this.retrieveAllGraphs().subscribe(graphs => {
      this._graphs = [this._graphs[0], ...graphs];
      this.updateGraphs();
    })
  }

  public setGraph(graph_name: string) : void {
    let i:number = 0;
    for(let g of this._graphs) {
      if (g.name === graph_name) {
        break;
      }
      i = i + 1;
    }
    this._currentGraph = i;
    this.updateCurrentGraphIndex();
    this.updateNodes();
    this.updateEdges();
  }

  public addNode(node:Node): void {
    console.log("Pushing node: " + node);
    this._graphs[this._currentGraph].graph.nodes.push(node);
    this.updateNodes();
  }

  public addEdge(edge:Edge): void {
    if(this.edgeExists(edge)) {
      console.log("Edge: " + edge + " already exists.");
      return;
    }

    console.log("Pushing edge: " + edge);
    this._graphs[this._currentGraph].graph.edges.push(edge);
    this.updateEdges();
  }

  public deleteNode(node):void {
    this._graphs[this._currentGraph].graph.nodes = 
      this._graphs[this._currentGraph].graph.nodes.filter(n => n !== node);
    this.deleteAllEdgesOfNode(node.id);
    this.updateNodes();
  }

  public deleteEdge(edge):void {
    this._graphs[this._currentGraph].graph.edges = 
      this._graphs[this._currentGraph].graph.edges.filter(e => e !== edge);
    this.updateEdges();
  }

  public getNodeById(id:string) {
    for(let node of this._graphs[this._currentGraph].graph.nodes) {
      if(node.id == id) {
        return node;
      }
    }
    return null;
  }

  public getEdgeById(id:string) {
    for(let edge of this._graphs[this._currentGraph].graph.edges) {
      if(edge.id == id) {
        return edge;
      }
    }
    return null;
  }

  public updateNodeById(id:string, node:Node) {
    for(let node of this._graphs[this._currentGraph].graph.nodes) {
      if(node.id == id) {
        node = node;
      }
    }
    this.updateNodes();
  }

  public updateEdgeById(id:string, node:Edge) {
    for(let edge of this._graphs[this._currentGraph].graph.edges) {
      if(edge.id == id) {
        edge = edge;
      }
    }
    this.updateEdges();
  }

  getGraphDTO(): GraphDTO {
    return this.graphs[this.currentGraph];
  }

  saveGraph(name:string): void {
    let ns = this._graphs[this.currentGraph].graph.nodes;
    let es = this._graphs[this.currentGraph].graph.edges;
    let g = {"nodes": ns, "edges":es}

    const url: string = graphBackendUrl + `?graphName=${name}`;
    this.http.post<any>(url, JSON.stringify(g), httpOptions)
      .subscribe(
        data => {
          this.retrieveAllGraphs().subscribe(graphs => {
            this._graphs = [this._graphs[0], ...graphs];
            this.updateGraphs();
            this.setGraph(name);
          })
        }, error => {
          alert("Error while saving graph.");
        }
      )
  }

  private retrieveAllGraphs(): Observable<GraphDTO[]> {
    const url: string = graphBackendUrl;
    return this.http.get<GraphDTO[]>(url, httpOptions)
  }

  private updateCurrentGraphIndex(): void{
    this._currentGraphObservable.next(this._currentGraph);
  }

  private updateGraphs() : void {
    this._graphsObservable.next(this._graphs);
  }

  private updateNodes(): void {
    this._nodesObservable.next(this._graphs[this._currentGraph].graph.nodes);
  }

  private updateEdges(): void {
    this._edgesObservable.next(this._graphs[this._currentGraph].graph.edges);
  }

  private edgeExists(edge: Edge): boolean {
    for(let e of this._graphs[this._currentGraph].graph.edges) {
      if(e.source == edge.source
        && e.target == edge.target) {
        return true;
      }
    }
    return false;
  }

  private deleteAllEdgesOfNode(node_id:string):void {
    this._graphs[this._currentGraph].graph.edges
      .filter(e => e.source == node_id || e.target == node_id)
      .forEach(e => this.deleteEdge(e));
  }

  get graphsObservable() : Subject<GraphDTO[]> {
    return this._graphsObservable;
  }

  get nodesObservable(): Subject<Node[]> {
    return this._nodesObservable;
  }

  get edgesObservable(): Subject<Edge[]> {
    return this._edgesObservable;
  }

  get currentGraphObservable(): Subject<number> {
    return this._currentGraphObservable;
  }

  get currentGraph(): number {
    return this._currentGraph;
  }

  get graphs(): GraphDTO[] {
    return this._graphs;
  }

  get nodes(): Node[] {
    return this._graphs[this._currentGraph].graph.nodes;
  }

  get edges(): Edge[] {
    return this._graphs[this._currentGraph].graph.edges;
  }

  get graphName(): String {
    return this._graphs[this._currentGraph].name;
  }

  set graphName(name:String) {
    this._graphs[this._currentGraph].name = name;
  }
}
