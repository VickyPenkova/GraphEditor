import { Component, OnInit } from '@angular/core';
import { GraphService, GraphDTO } from '../core/services/graph.service';

@Component({
  selector: 'app-select-graph',
  templateUrl: './select-graph.component.html',
  styleUrls: ['./select-graph.component.css']
})
export class SelectGraphComponent implements OnInit {

  private graphs: GraphDTO[] = [];
  private currentGraphIdx: number;
  
  constructor(private graphService:GraphService) { }

  ngOnInit() {
    this.graphs = this.graphService.graphs;
    this.currentGraphIdx = this.graphService.currentGraph;

    this.graphService.graphsObservable.subscribe(graphs => {
      this.graphs = graphs;
    });

    this.graphService.currentGraphObservable.subscribe(idx =>{
      this.currentGraphIdx = idx;
    });
  }

  onSelect(event):void {
    const graphName = event.target.value;
    this.graphService.setGraph(graphName);
  }

}
