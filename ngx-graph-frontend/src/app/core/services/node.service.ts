import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Node } from '@swimlane/ngx-graph';
import { GraphService } from './graph.service';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  private width:number = 100;
  private height:number = 100;
  private color:string = "#A1C057";

  constructor(private graphService: GraphService) { }

  addNode():string {
    let nextId = this.graphService.nodes.length + 1;
    let node: Node = {
      dimension: {width: this.width, height: this.height},
      meta: {
        forceDimensions: true,
        color: this.colorLuminance(this.color, this.getRandomArbitrary(-0.2, 0.2)),
        offset: -1
      },
      position:{
        x: 0,
        y: 0
      },
      id: "node"+(nextId).toString(),
      label: 'Node ' + (nextId).toString()
    }
    
    this.graphService.addNode(node);
    return "node"+(nextId).toString();
  }

  // TODO: reuse addNode
  public addLinkedNode(lbl:string, o:number, h:string):string {
    let nextId = this.graphService.nodes.length + 1;
    let node: Node = {
      dimension: {width: this.width, height: this.height},
      meta: {
        forceDimensions: true,
        color: this.colorLuminance(this.color, this.getRandomArbitrary(-0.2, 0.2)),
        offset: o,
        fileHash: h
      },
      position:{
        x: 0,
        y: 0
      },
      id: "node"+(nextId).toString(),
      label: lbl
    }
    
    this.graphService.addNode(node);
    return "node"+(nextId).toString();
  }

  private colorLuminance(hex, lum):string {

    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;
  
    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i*2,2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00"+c).substr(c.length);
    }
  
    return rgb;
  }

  private getRandomArbitrary(min, max):number {
    return Math.random() * (max - min) + min;
  }
}
