import { Injectable } from "@angular/core";
import { Node, Edge, Graph } from "@swimlane/ngx-graph";
import {Observable, Subject} from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {tap} from "rxjs/operators";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";

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
      "edges": edges,
      "annotations": []
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
  neighbours:Subject<string[]> = new Subject<string[]> ();

  //_files:Map<string,Map<string,string>> = new Map<string, Map<string,string> >();
  _files = {}
  //_filesObservable: Subject<Map<string, string>> = new Subject<Map<string, string>>();
  _filesObservable:Subject<any> = new Subject<any>();

  unsaved:Set<string> = new Set<string>();

  constructor(
      private http: HttpClient
  ) {
    this.retrieveAllGraphs().subscribe(graphs => {
      this._graphs = [this._graphs[0], ...graphs];

      for (let g of this._graphs) {
        this._files[g.name.toString()] = g.graph.annotations;
      }

      this.updateGraphs();
    })
  }

  public markAllNeighbours(id):void {
    let neighbours = []
    for(let edge of this._graphs[this._currentGraph].graph.edges) {
      if(edge.source == id) {
        neighbours.push(edge.target)
      }
    }
    this.neighbours.next(neighbours);
  }

  public updateFile(hash:string, html:string): void{
    let files = this._files[this._graphs[this.currentGraph].name.toString()];
    if (files !== undefined) {
      files[hash] = html
    } else {
      let m = {}
      m[hash] = html
      this._files[this._graphs[this.currentGraph].name.toString()] = m;
    }

    this._graphs[this.currentGraph].graph.annotations = 
      this._files[this._graphs[this.currentGraph].name.toString()];
    this._filesObservable.next(this._files[this._graphs[this.currentGraph].name.toString()]);
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
    this.unsaved.add(this._graphs[this._currentGraph].name.toString());
    this.updateNodes();
  }

  public addEdge(edge:Edge): void {
    if(this.edgeExists(edge)) {
      console.log("Edge: " + edge + " already exists.");
      return;
    }

    console.log("Pushing edge: " + edge);
    this._graphs[this._currentGraph].graph.edges.push(edge);
    this.unsaved.add(this._graphs[this._currentGraph].name.toString());
    this.updateEdges();
  }

  public deleteNode(node):void {
    this._graphs[this._currentGraph].graph.nodes = 
      this._graphs[this._currentGraph].graph.nodes.filter(n => n !== node);
    this.deleteAllEdgesOfNode(node.id);
    this.unsaved.add(this._graphs[this._currentGraph].name.toString());
    this.updateNodes();
  }

  public deleteEdge(edge):void {
    this._graphs[this._currentGraph].graph.edges = 
      this._graphs[this._currentGraph].graph.edges.filter(e => e !== edge);
    this.unsaved.add(this._graphs[this._currentGraph].name.toString());
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

  public updateNodeById(id:string, n:Node) {
    for(let node of this._graphs[this._currentGraph].graph.nodes) {
      if(node.id == id) {
        node = n;
      }
    }
    this.unsaved.add(this._graphs[this._currentGraph].name.toString());
    this.updateNodes();
  }

  public updateEdgeById(id:string, e:Edge) {
    for(let edge of this._graphs[this._currentGraph].graph.edges) {
      if(edge.id == id) {
        edge = e;
      }
    }
    this.unsaved.add(this._graphs[this._currentGraph].name.toString());
    this.updateEdges();
  }

  getGraphDTO(): GraphDTO {
    return this.graphs[this.currentGraph];
  }

  saveGraph(name:string): void {
    let ns = this._graphs[this.currentGraph].graph.nodes;
    let es = this._graphs[this.currentGraph].graph.edges;
    let as = this._graphs[this.currentGraph].graph.annotations;
    let saved_name:string = this._graphs[this.currentGraph].name.toString()
    let g = {"nodes": ns, "edges":es, "annotations": as}

    console.log("to save..")
    console.log(g)
    console.log(JSON.stringify(g))
    console.log("end save..")

    const url: string = graphBackendUrl + `?graphName=${name}`;
    this.http.post<any>(url, JSON.stringify(g), httpOptions)
      .subscribe(
        data => {
          this.retrieveAllGraphs().subscribe(graphs => {
            this.unsaved.delete(saved_name);
            this._graphs = [this._graphs[0], ...graphs];
            this.updateGraphs();
            this.setGraph(name);
          })
        }, error => {
          alert("Error while saving graph.");
          console.error(error)
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

  edgeExistsBetween(source_id, target_id): boolean {
    for(let e of this._graphs[this._currentGraph].graph.edges) {
      if(e.source == source_id && e.target == target_id) {
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

  set graphs(graphs: GraphDTO[]) {
    this._graphs = graphs;
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
