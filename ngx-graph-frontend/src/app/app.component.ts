import { Component, OnInit } from "@angular/core";
import * as shape from "d3-shape";
import { Edge, Node, ClusterNode, Layout } from "@swimlane/ngx-graph";
import { nodes, clusters, links } from "./data";
import { Subject } from "rxjs";
import { GraphService } from "./core/services/graph.service";
import { PluginService } from "./core/services/plugin.service"
import { NodeService } from "./core/services/node.service";
import { FormControl } from "@angular/forms";
import { EdgeService } from "./core/services/edge.service";
import { ItemEditService } from "./core/services/item-edit.service";

@Component({
  selector: "graph-visualizer",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {}
