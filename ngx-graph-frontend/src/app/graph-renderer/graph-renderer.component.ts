import { Component, OnInit } from '@angular/core';
import * as shape from 'd3-shape';
import * as $ from "jquery";
import { Edge, Node, ClusterNode, Layout } from '@swimlane/ngx-graph';
import { nodes, clusters, links } from '../data';
import { Subject } from 'rxjs';
import { GraphService } from '../core/services/graph.service';
import { NodeService } from '../core/services/node.service';
import { FormControl } from '@angular/forms';
import { EdgeService } from '../core/services/edge.service';
import { ItemEditService } from '../core/services/item-edit.service';
import { LayoutService } from '../core/services/layout.service';
import { Router } from '@angular/router';
import { AnnotateTextService } from '../core/services/annotate-text.service';
import { SteinerService } from '../core/services/steiner.service';

@Component({
  selector: 'app-graph-renderer',
  templateUrl: './graph-renderer.component.html',
  styleUrls: ['./graph-renderer.component.scss']
})
export class GraphRendererComponent implements OnInit {

  nodes: Node[] = []
  links: Edge[] = []

  update$: Subject<boolean> = new Subject();
  panToNode$: Subject<string> = new Subject();
  zoomToFit$: Subject<boolean> = new Subject();

  layout: String;

  private _mode: boolean;

  constructor(private graphService: GraphService,
              private nodeService: NodeService,
              private edgeService: EdgeService,
              private itemEditService: ItemEditService,
              private layoutService: LayoutService,
              private router: Router,
              private annotateTextService : AnnotateTextService,
              private steinerService: SteinerService) {
  }

  ngOnInit() {
    this.nodes = this.graphService.nodes;
    this.links = this.graphService.edges;

    this.setInterpolationType(this.curveType);
    this.fitGraph();
    this.setLayout(this.layoutService.layoutName);
    this.panToNode$.next("node1");

    this.update$.next(true);

    this.graphService.currentGraphObservable.subscribe(g => {
      this.steinerService.clearTerminalNodes();
      this.clusters = [];
    })

    this.steinerService.clearTerminalNodes();
    this.clusters = [];

    this.graphService.nodesObservable.subscribe(ns => {
      this.nodes = ns;
      console.log(ns);
      console.log(this.nodes);
      
      if(ns.length > 0) {
        this.panToNode$.next(ns[ns.length -1].id)
      }
      this.update$.next(true)
    });

    this.graphService.edgesObservable.subscribe(es => {
      this.links = es;
      this.update$.next(true)
    });

    this.graphService.neighbours.subscribe(nbs => {
      this.toolTip(nbs)
    })

    this.layoutService.layout.subscribe(l => {
      this.setLayout(l);
    });

    if (this.router.url.indexOf("annotate") !== -1) {
      this._mode = false;
    } else {
      this._mode = true;
    }
  }

  public clickNode(event, id): void {
    if (this._mode === true) {
      this.clickNodeBuild(event,id);
    } else {
      this.clickNodeAnnotate(event, id);
    }
  }

  public clickEdge(event, id): void {
    if (this._mode) {
      this.clickEdgeBuild(event,id);
    }
  }

  clusters: ClusterNode[] = [];

  curveType: string = 'Bundle';
  curve: any = shape.curveLinear;
  interpolationTypes = [
    'Bundle',
    'Cardinal',
    'Catmull Rom',
    'Linear',
    'Monotone X',
    'Monotone Y',
    'Natural',
    'Step',
    'Step After',
    'Step Before'
  ];  

  draggingEnabled: boolean = true;
  panningEnabled: boolean = true;
  zoomEnabled: boolean = true;

  zoomSpeed: number = 0.1;
  minZoomLevel: number = 0.1;
  maxZoomLevel: number = 4.0;
  panOnZoom: boolean = true;

  autoZoom: boolean = false;
  autoCenter: boolean = false; 
  center$: Subject<boolean> = new Subject();
   
  private setInterpolationType(curveType) {
    this.curveType = curveType;
    if (curveType === 'Bundle') {
      this.curve = shape.curveBundle.beta(1);
    }
    if (curveType === 'Cardinal') {
      this.curve = shape.curveCardinal;
    }
    if (curveType === 'Catmull Rom') {
      this.curve = shape.curveCatmullRom;
    }
    if (curveType === 'Linear') {
      this.curve = shape.curveLinear;
    }
    if (curveType === 'Monotone X') {
      this.curve = shape.curveMonotoneX;
    }
    if (curveType === 'Monotone Y') {
      this.curve = shape.curveMonotoneY;
    }
    if (curveType === 'Natural') {
      this.curve = shape.curveNatural;
    }
    if (curveType === 'Step') {
      this.curve = shape.curveStep;
    }
    if (curveType === 'Step After') {
      this.curve = shape.curveStepAfter;
    }
    if (curveType === 'Step Before') {
      this.curve = shape.curveStepBefore;
    }
  }

  private fitGraph() {
    this.zoomToFit$.next(true)
  }

  private setLayout(layoutName: String): void {
    const layout = this.layoutService.layouts.find(l => l.value === layoutName);
    this.layout = layoutName;
    if (!layout.isClustered) {
      this.clusters = undefined;
    } else {
      this.clusters = [];
    }
  }

  private clickNodeBuild(event, id) {
    if (this.edgeService.addingEdge){
      this.edgeService.addNodeToEdge(id);
    } else {
      this.openNodeForEditting(id);
    }
  }

  private clickNodeAnnotate(event, id) {
    if(event.shiftKey) {
      let nodesInSteinerTree:string[] = this.steinerService.addTerminalNode(id)
      if (nodesInSteinerTree.length == 0 || nodesInSteinerTree[0] == undefined) {
        this.clusters = []
        return
      }
      let cluster:ClusterNode = {
        id: 'third',
        label: 'Steiner Tree of Selected Nodes',
        childNodeIds: nodesInSteinerTree,
        meta: {
          color: "#1B6271"
        }
      }
      this.clusters = [cluster]
    } else {
      this.edgeService.addTarget(id);
      this.annotateTextService.click();
    }
  }

  private openNodeForEditting(id) {
    let node:Node = this.graphService.getNodeById(id);
    this.itemEditService.openItemForEditting(node);
  }

  private clickEdgeBuild(event, id) {
    this.openEdgeForEditting(id);
  }

  private openEdgeForEditting(id) {
    let edge:Edge = this.graphService.getEdgeById(id);
    this.itemEditService.openItemForEditting(edge);
  }

  private toolTip(neighbours): void {
    $(".pin__group").css({"animation-name": "" });
    $(".pin__grayGroup").css({"animation-name": "" });
    $(".pin__square").css({"animation-name": "" });
    $(".pin__line-1").css({"animation-name": "" });
    $(".pin__line-2").css({"animation-name": "" });
    $(".pin__line-3").css({"animation-name": "" });
    $(".pin__circleBig").css({"animation-name": "" });
    $(".pin__circleSmall").css({"animation-name": "" });
    $(".pin__outer").css({"animation-name": "" });
    $(".pin__inner").css({"animation-name": "" });

    setTimeout(()=>{
      for (let n of neighbours) {
        $("#n"+n).find(".pin__group").css({"animation-name": "group-anim" });
        $("#n"+n).find(".pin__grayGroup").css({"animation-name": "gray-anim" });
        $("#n"+n).find(".pin__square").css({"animation-name": "square-anim" });
        $("#n"+n).find(".pin__line-1").css({"animation-name": "line-anim" });
        $("#n"+n).find(".pin__line-2").css({"animation-name": "line-anim" });
        $("#n"+n).find(".pin__line-3").css({"animation-name": "line-anim" });
        $("#n"+n).find(".pin__circleBig").css({"animation-name": "bigCircle-anim" });
        $("#n"+n).find(".pin__circleSmall").css({"animation-name": "smallCircle-anim" });
        $("#n"+n).find(".pin__outer").css({"animation-name": "outer-anim" });
        $("#n"+n).find(".pin__inner").css({"animation-name": "inner-anim" });
      }
    }, 100)
    
  }

}
