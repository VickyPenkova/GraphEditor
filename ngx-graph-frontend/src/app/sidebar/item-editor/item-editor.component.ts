import { Component, OnInit, Input } from '@angular/core';
import { GraphService } from '../../core/services/graph.service';
import { Node } from '@swimlane/ngx-graph';
import { ItemEditService } from '../../core/services/item-edit.service';
import { AnnotationService } from '../../core/services/annotation.service';

@Component({
  selector: 'app-item-editor',
  templateUrl: './item-editor.component.html',
  styleUrls: ['./item-editor.component.scss']
})
export class ItemEditorComponent implements OnInit {

  @Input() private item: any;

  private _color:string;
  private _label:string;
  private _dim:number;

  private _scale:number = 0;

  private isNode:boolean;

  constructor(private graphService:GraphService,
              private itemEditService:ItemEditService,
              private annotationService: AnnotationService) { }

  ngOnInit() {
    if(this.item.meta != null) {
      this.isNode = true;
      this._color = this.item.meta.color;
      this._dim = this.item.dimension.width;
      this._label = this.item.label;
    } else {
      this.isNode = false;
      this._color = this.item.data.color;
      this._dim = this.item.data.stroke_width
      this._label = this.item.data.label;
    }
    
  }

  delete(): void {
    if(this.isNode) {
      let txt = this.annotationService.text

      let to_replace_start = '<span id="' + this.item.id;
      let to_replace_end = '</span>'

      let idx_start = txt.indexOf(to_replace_start)
      let idx_end = txt.indexOf(to_replace_end, idx_start)

      let txtOffset = this.item.id.indexOf('_')

      txt = txt.substring(0, idx_start) + this.item.id.substring(txtOffset + 1) + txt.substring(idx_end);
      
      this.graphService.updateFile(this.annotationService.hash, txt);
      this.graphService.deleteNode(this.item);
    } else {
      this.graphService.deleteEdge(this.item);
    }
    this.itemEditService.closeItemForEditting(this.item);
  }

  setItemColor(event): void {
    this._color = event;
    this._update();
  }

  onKeyUp(event, value): void {
    this._label = value;
    this._update();
  }

  scale(event, plus) {
    this._scale = this._scale + plus;
    this._update();
  }

  private _update():void {
    if (this.isNode) {
      let s: number = 5 * this._scale;
      if (this.item.dimension.width + s > 0) {
        this.item.dimension.width += s;
        this.item.dimension.height += s;
        this._dim += s;
      } else {
        console.log("Cannot scale to smaller than 1 px.")
      }
      this.item.label = this._label;
      this.item.meta.color = this._color;
      this.graphService.updateNodeById(this.item.id, this.item);
    } else {
      if (this.item.data.stroke_width + this._scale > 0) {
        this.item.data.stroke_width += this._scale;
        this._dim += this._scale;
      } else {
        console.log("Cannot scale to smaller than 1 px.")
      }
      this.item.data.label = this._label;
      this.item.data.color = this._color;
      this.graphService.updateEdgeById(this.item.id, this.item);
    }
    this._scale = 0;
  }

}
