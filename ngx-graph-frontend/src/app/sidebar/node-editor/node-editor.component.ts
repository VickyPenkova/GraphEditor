import { Component, OnInit, Input } from '@angular/core';
import { Node } from '@swimlane/ngx-graph';
import { GraphService } from '../../core/services/graph.service';

@Component({
  selector: 'app-node-editor',
  templateUrl: './node-editor.component.html',
  styleUrls: ['./node-editor.component.scss']
})
export class NodeEditorComponent implements OnInit {

  @Input() private node: Node;

  constructor(private graphService:GraphService) { }

  ngOnInit() {
  }

  setNodeColor(event): void {
    this.node.meta.color = event;
  }

  onKeyUp(event, value): void {
    this.node.label = value;
    this.graphService.updateNodeById(this.node.id, this.node);
  }

  scale(event, plus) {
    if (this.node.dimension.width + plus > 0) {
      this.node.dimension.width += plus;
      this.node.dimension.height += plus;
      this.graphService.updateNodeById(this.node.id, this.node);
    } else {
      console.log("Cannot scale to smaller than 1 px.")
    }
    
  }

}
