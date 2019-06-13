import { Component, OnInit } from '@angular/core';
import { GraphService } from '../core/services/graph.service';
import { PluginService } from '../core/services/plugin.service';

@Component({
  selector: 'app-autoannotate',
  templateUrl: './autoannotate.component.html',
  styleUrls: ['./autoannotate.component.css']
})
export class AutoannotateComponent implements OnInit {

  constructor(
    private graphService:GraphService,
    private pluginService:PluginService
    ) {
  }

  textauto: string;

  autoAnnotate(): void {

    if (this.graphService.graphName === 'parts_of_speech') {
      
      this.pluginService.autoAnnotate(this.textauto);
    } else {
      alert("This feature is supported only for the 'parts_of_speech' graph")
    }
  
  }

  ngOnInit() {
    console.log("HERE")
  }
}
