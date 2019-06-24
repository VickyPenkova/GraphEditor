import { Component, OnInit } from "@angular/core";
import { AnnotationService } from "../core/services/annotation.service";
import * as $ from "jquery";
import { EdgeService } from "../core/services/edge.service";
import { Subject } from "rxjs";
import { DomSanitizer, SafeHtml } from "@angular/platform-browser";
import { GraphService } from "../core/services/graph.service";
import { GraphRendererComponent } from "../graph-renderer/graph-renderer.component";

@Component({
  selector: "app-annotate-text-new",
  templateUrl: "./annotate-text-new.component.html",
  styleUrls: ["./annotate-text-new.component.css"]
})
export class AnnotateTextNewComponent implements OnInit {

  txt:SafeHtml;
  markedWord:string;

  constructor(private annotationService:AnnotationService,
              private edgeService:EdgeService,
              private graphService: GraphService,
              private sanitized: DomSanitizer) { }

  ngOnInit() {
    const ths = this;
    $(document).on('click', ".markedWord", function(event){
      ths.graphService.markAllNeighbours(event.target.id)
    })

    this.annotationService.textObservable.subscribe( t=> {
      this.txt = this.sanitized.bypassSecurityTrustHtml(t)
    })

    this.txt = this.sanitized.bypassSecurityTrustHtml(this.annotationService.text);
  }

  changeOfFile(event) {
    var fileReader = new FileReader();
    fileReader.onload = e => {
      var text:string = fileReader.result as string;
      this.annotationService.text = text;
    };
    var file = event.target.files[0];
    if (file) {
      fileReader.readAsText(file, "CP1251");
    }
  }
  
  public handleTextSelection(event) {
    var span = document.createElement("span");
    span.style.fontWeight = "bold";
    span.style.color = "green";
    span.style.backgroundColor = "white";
    span.style.color = "#a0be56";
    span.style.borderRadius = "5px";
    span.style.border = "1px solid black"

    let caretOffset;
    if (typeof window.getSelection != "undefined") {
      var range = window.getSelection().getRangeAt(0);
      var selected = range.toString().length; // *
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(document.getElementById("containerForFileInput"));
      preCaretRange.setEnd(range.endContainer, range.endOffset);
    
      if(selected){ // *
        caretOffset = preCaretRange.toString().length - selected; // *
      } else { // *
        caretOffset = preCaretRange.toString().length; 
      } // *

      var sel = window.getSelection();
      let content = range.cloneContents().textContent;

      if(content == undefined || content.length < 1) {
        return;
      }
      span.id = caretOffset + "_" + (content.replace(/(\r\n|\n|\r|\.)/gm, "").replace(/ /g,""));
      if(document.getElementById(span.id) != undefined) {
        return;
      }

      let pd:number = 3 * this.getInnerDepth(range.cloneContents());
      span.style.padding = pd + "px"
      span.classList.add("markedWord")
      span.style.cursor = "pointer"

      const currentHtml = document.getElementById("containerForFileInput").innerHTML

      range.surroundContents(span);
      //sel.removeAllRanges();
      //sel.addRange(range);
      
      // TODO: IMPORTANT
      const potentialHtml = document.getElementById("containerForFileInput").innerHTML

      console.log("current:")
      console.log(currentHtml)
      console.log("potential:")
      console.log(potentialHtml)

      /*$("#" + span.id).replaceWith(function () {
        return $(this).text();
      });*/

      this.txt = this.sanitized.bypassSecurityTrustHtml(currentHtml);

      this.markedWord = content;
      this.edgeService.addSource(this.markedWord, span.id, this.annotationService.hash, potentialHtml);
    }
  }

  mouseEnter(event):void {
    alert("here")
  }

  getInnerDepth(parent): number{ 
    var depth = 1; 
    if (parent.children.length) {
      var childDepth = 0;
      for(var i=0; i<parent.children.length; i++){
        childDepth = Math.max(this.getInnerDepth(parent.children[i]), childDepth);
      };
      depth += childDepth;
    }
    return depth;
  }

 
}
