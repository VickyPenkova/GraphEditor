import { Injectable } from '@angular/core';
import { GraphService } from './graph.service';

class Path {
  from:number;
  to:number;
  dist:number;
  path:number[] = []
}

@Injectable({
  providedIn: 'root'
})
export class SteinerService {

  inf:number = 1000000;
  terminalNodes:string[] = []
  allPaths:Path[] = []

  constructor(private graphService:GraphService) {
    //this.graphService.nodesObservable
  }

  main():void {
    let weights:number[][]  = [[1, 3, -2], [2, 1, 4], [2, 3, 3], [3, 4, 2], [4, 2, -1]];
    let numVertices:number = 4;

    this.floydWarshall(weights, numVertices);
  }

  private floydWarshall(weights:number[][] , numVertices:number ) {

    let dist:number[][] = [];

    for(let i: number = 0; i < numVertices; i++) {
      dist[i] = [];
      for(let j: number = 0; j< numVertices; j++) {
        dist[i][j] = this.inf;
      }
    }

    for(let w of weights) {
      dist[w[0] - 1][w[1] - 1] = w[2];
    }

    let next:number[][] = []
    for(let i = 0; i < numVertices; i++) {
      next[i] = [];
      for(let j: number = 0; j< numVertices; j++) {
        next[i][j] = 0;
      }
    }
    
    for (let i:number = 0; i < next.length; i++) {
      for (let j:number = 0; j < next.length; j++)
        if (i != j)
            next[i][j] = j + 1;
    }

    for (let k:number = 0; k < numVertices; k++)
      for (let i:number = 0; i < numVertices; i++)
        for (let j:number = 0; j < numVertices; j++)
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            next[i][j] = next[i][k];
          }
 
    this.constuctAllPaths(dist, next);
    //this.allPaths = this.allPaths.filter( p => p.dist != this.inf)
    console.log(this.allPaths);
  }

  private constuctAllPaths(dist:number[][], next:number[][]):void {
    for (let i:number = 0; i < next.length; i++) {
      for (let j:number = 0; j < next.length; j++) {
        if (i != j) {
          let u:number = i + 1;
          let v:number = j + 1;
          
          let p = new Path();
          p.from = u;
          p.to = v;
          p.dist = dist[i][j];
          p.path.push(u);

          do {
            u = next[u - 1][v - 1];
            p.path.push(u)
          } while (u != v);
          this.allPaths.push(p);
        }
      }
    }
  }
 
  private printResult(dist:number[][], next:number[][]):void {
    console.log("pair     dist    path");
    for (let i:number = 0; i < next.length; i++) {
      for (let j:number = 0; j < next.length; j++) {
        if (i != j) {
          let u:number = i + 1;
          let v:number = j + 1;
          let path:string = u + " -> " + v + "    " + dist[i][j] + "    " + u
          do {
            u = next[u - 1][v - 1];
            path += " -> " + u;
          } while (u != v);
          console.log(path);
        }
      }
    }
  }

  public constructTree(): string[] {
    let weights:number[][] = []
    let numVertices:number = this.graphService.nodes.length;

    let mappingWordToNumber:Map<string, number> = new Map<string,number>();
    let mappingNumberToWord:Map<number, string> = new Map<number,string>();

    let i = 1;
    for(let e of this.graphService.edges) {
      if(!mappingWordToNumber.has(e.source)){
        mappingWordToNumber.set(e.source, i);
        mappingNumberToWord.set(i, e.source);
        i++;
      }

      if(!mappingWordToNumber.has(e.target)){
        mappingWordToNumber.set(e.target, i);
        mappingNumberToWord.set(i, e.target);
        i++;
      }
      weights.push([mappingWordToNumber.get(e.source), mappingWordToNumber.get(e.target), 1])
    }

    this.floydWarshall(weights, numVertices);
    return this.steiner(mappingWordToNumber, mappingNumberToWord)
    //this.allPaths.filter( p => p.dist != this.inf)

    /*console.log("pair     dist    path");
    for(let p of this.allPaths) {
      let path:string = mappingNumberToWord.get(p.from) + " -> " + mappingNumberToWord.get(p.to) + "    " + p.dist + "    " + p.path
      console.log(path);
    }*/
  }

  private getPath(from, to):number[] {
    for(let p of this.allPaths) {
      if (p.from == from && p.to == to) {
        return p.path;
      } 
    }
  }

  private getDistance(from, to): number {
    for(let p of this.allPaths) {
      if (p.from == from && p.to == to) {
        return p.dist;
      } 
    }
  }

  private steiner(mappingWordToNumber:Map<string, number>, mappingNumberToWord:Map<number, string>):string[] {
    let tns:Set<number> = new Set<number>();
    for (let tn of this.terminalNodes) {
      tns.add(mappingWordToNumber.get(tn));
    }

    console.log("real term nodes:")
    console.log(this.terminalNodes)

    console.log("terminal nodes:")
    console.log(tns)

    let T:Set<number> = new Set<number>();
    T.add(tns.values().next().value)

    while(!this.setContains(T,tns)) {
      console.log("steiner Tree nodes:")
      console.log(T)
      
      let minDistance = 2 * this.inf;
      let TN;
      let from:number;
      let to:number;
      for (var steinerTreeValue of Array.from(T.values())) {
        for (var terminalNode of Array.from(tns.values())) {
          console.log("looking for smallest path from " + terminalNode + " to " + steinerTreeValue)
          if (T.has(terminalNode)) {
            continue;
          }

          let d = this.getDistance(terminalNode, steinerTreeValue);
          if(d < minDistance){
            minDistance = d;
            from = terminalNode;
            to = steinerTreeValue;
            TN = terminalNode;
          }
          d = this.getDistance(steinerTreeValue, terminalNode);
          if(d < minDistance){
            minDistance = d;
            from = steinerTreeValue;
            to = terminalNode;
            TN = terminalNode
          }
        }
      }
      if (minDistance >= this.inf) {
        T.add(TN)
        continue;
      }
      for (let e of this.getPath(from, to)){
        T.add(e);
      }
    }
    console.log("Steiner tree elements:")
    console.log(T);

    let result = []
    for (var v of Array.from(T.values())) {
      result.push(mappingNumberToWord.get(v))
    }

    console.log("steiner result:")
    console.log(result)
    return result;
  }

  private setContains(s1, s2) {
    for (var v of Array.from(s2.values())) {
      if(!s1.has(v)){
        return false;
      }
    }
    return true;
  }

  public addTerminalNode(id:string):string[] {
    let index = this.terminalNodes.indexOf(id);
    if (index !== -1){
      this.terminalNodes.splice(index, 1);
    } else {
      this.terminalNodes.push(id);
    }
    return this.constructTree();
  }

  public clearTerminalNodes(): void {
    this.terminalNodes = []
  }
}
