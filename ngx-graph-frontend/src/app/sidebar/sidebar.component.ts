import { Component, OnInit } from '@angular/core';
import { GraphService } from '../core/services/graph.service';
import { Node } from '@swimlane/ngx-graph';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  private id:number = 0;
  private width:number = 100;
  private height:number = 100;
  private color:string = "#A1C057";

  constructor(private graphService: GraphService) { }

  ngOnInit() {
  }

  addNode():void {
    let node: Node = {
      dimension: {width: this.width, height: this.height},
      meta: {
        forceDimensions: true,
        color: this.colorLuminance(this.color, this.getRandomArbitrary(-0.2, 0.2))
      },
      position:{
        x: 0,
        y: 0
      },
      id: (this.id++).toString(),
      label: 'Node ' + (this.id).toString()
    }
    
    this.graphService.addNode(node);
  }

  colorLuminance(hex, lum):string {

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

  getRandomArbitrary(min, max):number {
    return Math.random() * (max - min) + min;
  }
}
