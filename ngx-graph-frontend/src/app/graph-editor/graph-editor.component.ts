import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ItemEditService } from '../core/services/item-edit.service';
import { LayoutService } from '../core/services/layout.service';

@Component({
  selector: 'app-graph-editor',
  templateUrl: './graph-editor.component.html',
  styleUrls: ['./graph-editor.component.css']
})
export class GraphEditorComponent implements OnInit {

  constructor( private itemEditService: ItemEditService,
              private layoutService: LayoutService) { }

  ngOnInit() {
  }

  private activate = new FormControl();

  toggleMultipleEditors() {
    this.itemEditService.multipleEditors = this.activate.value;
  }

}
