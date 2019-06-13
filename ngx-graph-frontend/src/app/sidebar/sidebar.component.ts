import { Component, OnInit } from "@angular/core";
import { GraphService } from "../core/services/graph.service";
import { Node, Edge } from "@swimlane/ngx-graph";
import { NodeService } from "../core/services/node.service";
import { EdgeService } from "../core/services/edge.service";
import { ItemEditService } from "../core/services/item-edit.service";
import { saveAs } from "file-saver";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"]
})
export class SidebarComponent implements OnInit {
  private itemsOpenForEditting: any[];

  constructor(private nodeService: NodeService,
              private itemEditService: ItemEditService,
              private edgeService: EdgeService,
              private graphService: GraphService) { }

  ngOnInit() {
    this.itemEditService.observeItemsOpenForEditting.subscribe(itemsOpenForEditting => {
      this.itemsOpenForEditting = itemsOpenForEditting;
    });

    this.itemsOpenForEditting = this.itemEditService.itemsOpenForEditting;
  }

  downloadGraph() {
    saveAs(new Blob([JSON.stringify(this.graphService.getGraphDTO())], {type: "application/json" }), this.graphService.graphName);
  }

  saveGraph() :void {
    let name = this.graphService.graphName.toString()
    this.graphService.saveGraph(name);
  }

  saveGraphAs(): void {
    let name = prompt("Enter graph name.", "e.g. graph 1");
    if (name == undefined){
      return
    }
    for (let g of this.graphService.graphs) {
      if(name == g.name) {
        alert("Graph " + name + " already exists. To modify it, please select it from the dropdown.")
        return;
      }
    }
    this.graphService.saveGraph(name);
  }

  onFileChanged(event) {
    if (event.target.files && event.target.files[0]) {
      const fileReader: FileReader = new FileReader();
      fileReader.readAsText(event.target.files[0], "UTF-8");
      fileReader.onload = () => {
        if (typeof fileReader.result === "string") {
          const graphJson: any = JSON.parse(fileReader.result);
          for (let node of graphJson.graph.nodes) {
            this.graphService.addNode(node);
          }

          for (let edge of graphJson.graph.edges) {
            this.graphService.addEdge(edge);
          }
          // this.graphService.nodes = graphJson.graph.nodes;
        }
      };
      fileReader.onerror = (error) => {
        console.log(error);
      };
    }
  }
}
