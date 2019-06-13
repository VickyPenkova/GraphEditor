import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  private _layoutName: String = 'dagreCluster';
  private _layout: Subject<String> = new Subject<String> ();

  private _layouts: any[] = [
    /*{
      label: 'Dagre',
      value: 'dagre',
    },*/
    {
      label: 'Dagre Cluster',
      value: 'dagreCluster',
      isClustered: true,
    }/*,
    {
      label: 'Cola Force Directed',
      value: 'colaForceDirected',
      isClustered: true,
    },
    {
      label: 'D3 Force Directed',
      value: 'd3ForceDirected',
    },*/
  ];

  constructor() {
    this._layout.next(this._layoutName);
  }

  setLayout(name) {
    this._layout.next(name);
    this._layoutName = name;
  }

  get layouts(): any[] {
    return this._layouts;
  }

  get layoutName(): String {
    return this._layoutName;
  }

  get layout():Subject<String> {
    return this._layout;
  }
}
