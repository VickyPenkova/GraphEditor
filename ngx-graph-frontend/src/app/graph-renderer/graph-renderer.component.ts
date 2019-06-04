import { Component, OnInit } from '@angular/core';
import * as shape from 'd3-shape';
import { Edge, Node, ClusterNode, Layout } from '@swimlane/ngx-graph';
import { nodes, clusters, links } from '../data';
import { Subject } from 'rxjs';
import { GraphService } from '../core/services/graph.service';
import { NodeService } from '../core/services/node.service';
import { FormControl } from '@angular/forms';
import { EdgeService } from '../core/services/edge.service';
import { ItemEditService } from '../core/services/item-edit.service';

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

  constructor(private graphService: GraphService,
              private nodeService: NodeService,
              private edgeService: EdgeService,
              private itemEditService: ItemEditService) {
  }

  ngOnInit() {
    this.graphService.nodesObservable.subscribe(ns => {
      this.nodes = ns;
      this.update$.next(true)

      if(ns.length > 0) {
        this.panToNode$.next(ns[ns.length -1].id)
      }
    });

    this.graphService.edgesObservable.subscribe(es => {
      this.links = es;
      this.update$.next(true)
    });
  
    this.setInterpolationType(this.curveType);
    this.fitGraph();
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
  fitGraph() {
    this.zoomToFit$.next(true)
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

  clickNode(event, id) {
    if (this.edgeService.addingEdge){
      this.edgeService.addNodeToEdge(id);
    } else {
      this.openNodeForEditting(id);
    }
  }

  openNodeForEditting(id) {
    let node:Node = this.graphService.getNodeById(id);
    this.itemEditService.openItemForEditting(node);
  }

  clickEdge(event, id) {
    this.openEdgeForEditting(id);
  }

  openEdgeForEditting(id) {
    let edge:Edge = this.graphService.getEdgeById(id);
    this.itemEditService.openItemForEditting(edge);
  }

  private activate = new FormControl();

  toggleMultipleEditors() {
    this.itemEditService.multipleEditors = this.activate.value;
  }

}
