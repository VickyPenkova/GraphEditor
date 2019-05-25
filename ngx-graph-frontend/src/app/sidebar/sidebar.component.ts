import { Component, OnInit } from '@angular/core';
import { GraphService } from '../core/services/graph.service';
import { Node, Edge } from '@swimlane/ngx-graph';
import { NodeService } from '../core/services/node.service';
import { EdgeService } from '../core/services/edge.service';
import { ItemEditService } from '../core/services/item-edit.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  private itemsOpenForEditting: any[];

  constructor(private nodeService: NodeService,
              private itemEditService: ItemEditService,
              private edgeService: EdgeService) { }

  ngOnInit() {
    this.itemEditService.observeItemsOpenForEditting.subscribe(itemsOpenForEditting => {
      this.itemsOpenForEditting = itemsOpenForEditting;
    });
  }

}
