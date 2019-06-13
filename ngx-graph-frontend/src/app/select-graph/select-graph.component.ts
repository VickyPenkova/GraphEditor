import { Component, OnInit } from '@angular/core';
import { GraphService, GraphDTO } from '../core/services/graph.service';
import { ItemEditService } from '../core/services/item-edit.service';
import { PluginService } from '../core/services/plugin.service';

@Component({
  selector: 'app-select-graph',
  templateUrl: './select-graph.component.html',
  styleUrls: ['./select-graph.component.css']
})
export class SelectGraphComponent implements OnInit {

  private graphs: GraphDTO[] = [];
  private currentGraphIdx: number;
  
  constructor(private graphService:GraphService,
            private itemEditService: ItemEditService) { }

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
    this.itemEditService.closeAll();
  }

}
