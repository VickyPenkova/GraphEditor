import { Component, OnInit } from '@angular/core';
import * as shape from 'd3-shape';
import { Edge, Node, ClusterNode, Layout } from '@swimlane/ngx-graph';
import { nodes, clusters, links } from './data';
import { Subject } from 'rxjs';
import { GraphService } from './core/services/graph.service';
import { NodeService } from './core/services/node.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'graph-visualizer',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent implements OnInit {

  nodes: Node[] = []
  links: Edge[] = []

  update$: Subject<boolean> = new Subject();
  panToNode$: Subject<string> = new Subject();

  constructor(private graphService: GraphService,
              private nodeService: NodeService) {
  }

  ngOnInit() {
    this.graphService.nodesObservable.subscribe(ns => {
      this.nodes = ns;
      this.update$.next(true)
      this.panToNode$.next(ns[ns.length -1].id)
    });
    this.setInterpolationType(this.curveType);
  }

  name = 'NGX-Graph Demo';

  //nodes: Node[] = nodes;
  clusters: ClusterNode[] = clusters;

  //links: Edge[] = links;
  
  layout: String | Layout = 'colaForceDirected';
  layouts: any[] = [
    {
      label: 'Dagre',
      value: 'dagre',
    },
    {
      label: 'Dagre Cluster',
      value: 'dagreCluster',
      isClustered: true,
    },
    {
      label: 'Cola Force Directed',
      value: 'colaForceDirected',
      isClustered: true,
    },
    {
      label: 'D3 Force Directed',
      value: 'd3ForceDirected',
    },
  ];


  // line interpolation
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
  zoomToFit$: Subject<boolean> = new Subject();
   
  setInterpolationType(curveType) {
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

  setLayout(layoutName: string): void {
    const layout = this.layouts.find(l => l.value === layoutName);
    this.layout = layoutName;
    if (!layout.isClustered) {
      this.clusters = undefined;
    } else {
      this.clusters = clusters;
    }
  }

  openNodeForEditting(event, id) {
    let node:Node = this.graphService.getNodeById(id);
    this.nodeService.openNodeForEditting(node);

    for(let node of this.nodes) {
      console.log(node);
    }
  }

  private activate = new FormControl();

  toggleMultipleEditors() {
    this.nodeService.multipleEditors = this.activate.value;
  }
}
