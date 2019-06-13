import { Component, OnInit } from "@angular/core";
import { AnnotateTextService, IndexedWord } from "../core/services/annotate-text.service";
import * as $ from "jquery";
import { checkAndUpdateTextDynamic } from "@angular/core/src/view/text";
import { NodeService } from "../core/services/node.service";
import { EdgeService } from "../core/services/edge.service";
import { element } from "@angular/core/src/render3";
import { GraphService } from "../core/services/graph.service";

@Component({
  selector: "app-anotate-text",
  templateUrl: "./anotate-text.component.html",
  styleUrls: ["./anotate-text.component.css"]
})
export class AnotateTextComponent implements OnInit {
  displayedText: String;
  markedWord: String;
  nodeLabelDict = {};
  dta: IndexedWord[];

  constructor(private annotateTextService: AnnotateTextService,
              private edgeService: EdgeService,
              private graphService: GraphService) { }

  ngOnInit() {
    this.annotateTextService._wordsObservable.subscribe(e => {
      this.dta = this.annotateTextService.wordsInText;
      this.displayedText = e;
      console.log("from NG INIT")
      this.colorWords();
      //this.annotateTextService.wordsInText = this.dta;
      //this.dta = this.annotateTextService.wordsInText;
    });

    this.graphService.currentGraphObservable.subscribe(g=>{
      console.log("from change graph")
      this.colorWords();
    })

    this.displayedText = this.annotateTextService._words;
    this.dta = this.annotateTextService.wordsInText;
    console.log("from change page")
    this.colorWords();
    //this.annotateTextService.setWords('asddsa <span class="colored">asdda</span> hiasa')


   // alert($('.colored').html)
    $('.colored').css("background-color","red");

    this.annotateTextService.clicked.subscribe(c => {
      //this.colorWords();
    });

    //display the name of the selected file in the label
    $('input[type="file"]').change(function(e) {
      var file = e.target.files[0];
      if (file) {
        $("#uploaded-file-title").text(
          'The file "' + file.name + '" has been selected.'
        );
      }
    });
  }

  //read the uploaded file
  changeOfFile(event) {
    var fileReader = new FileReader();
    fileReader.onload = e => {
      var data = fileReader.result;
      this.annotateTextService.setWords(data.toString());
    };
    var file = event.target.files[0];
    if (file) {
      fileReader.readAsText(file, "CP1251");
    }
  }
  //get selected text
  getSelectionText() {
    var text = window.getSelection();
    var start:number = -1;
    if (window.getSelection) {
      if (document.getElementById("tempSelected")) {
        var nodeToBeRemoved = document.getElementById("tempSelected");
        while (nodeToBeRemoved.firstChild) {
          nodeToBeRemoved.parentNode.insertBefore(
            nodeToBeRemoved.firstChild,
            nodeToBeRemoved
          );
        }
        nodeToBeRemoved.parentNode.removeChild(nodeToBeRemoved);
      }
      start = text.anchorOffset;
      var range = window.getSelection().getRangeAt(0);
      console.log("range:")
      if (range.cloneContents().children.length > 0){
        let sp = range.cloneContents().children[0];
        start = parseInt(sp.id);
      } 

      var selectionContents = range.extractContents();
      var span = document.createElement("span");
      span.id = "tempSelected";
      span.appendChild(selectionContents);

      span.style.backgroundColor = "#9DB660";
      span.style.color = "black";

      range.insertNode(span);
    } else if (
      document.getSelection() &&
      document.getSelection().type != "Control"
    ) {
    }
    return [text, start];
  }

  private hashCode(str):string {
    return str.split('').reduce((prevHash, currVal) =>
      (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
  }

  handleTextSelection(event) {
    let res = this.getSelectionText();

    if(parseInt(res[1].toString()) == -1){
      return;
    }
    this.markedWord = res[0].toString()
    let offset:number = parseInt(res[1].toString())
    let hash: string = this.hashCode(this.displayedText);
    
    //this.edgeService.addSource(this.markedWord.toString(), offset, hash );
  }

  txt:string = 'asdasdasd sasad sad sadsad sda sda sad dsasda sadsa sdasadasd sad asddsa'
  handleTextSelectionNew(event) {
    //let selected = window.getSelection().getRangeAt(0).cloneContents(); 
    //alert(selected);

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
      let spanId = range.cloneContents().textContent;

      if(spanId == undefined || spanId.length < 1) {
        return;
      }
      span.id = caretOffset + spanId;

      let pd:number = 3 * this.getInnerDepth(range.cloneContents());
      span.style.padding = pd + "px"

      range.surroundContents(span);
      sel.removeAllRanges();
      sel.addRange(range);
    }

    /*if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var range = sel.getRangeAt(0).cloneRange();

            let spanId = range.cloneContents().textContent;
            alert(sel.anchorOffset);
            if(spanId == undefined) {
              return;
            }
            span.id = spanId;

            range.surroundContents(span);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }*/
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

  /*public c() {
    document.getElementById("tempSelected").style.backgroundColor = "#282828";
    document.getElementById("tempSelected").style.color = "#a0be56";
    document.getElementById("tempSelected").style.borderRadius = "5px";
    document.getElementById("tempSelected").style.padding = "2px";
    //document.getElementById("tempSelected").style.userSelect = "none";
    document.getElementById("tempSelected").id = "notSelected";
  }*/

  changeTextOfNode(event) {
    var selectedNodeID = event.currentTarget.id;
    event.currentTarget.innerHTML = document.getElementById(
      "tempSelected"
    ).innerHTML;
    var that = this;
    var idToBe = selectedNodeID + "Label";
    (function() {
      if (document.getElementById(idToBe) !== null) {
        document.getElementById(idToBe).style.color = "";
        //remove the span around the element
        var nodeToBeRemoved = document.getElementById(idToBe);
        while (nodeToBeRemoved.firstChild) {
          nodeToBeRemoved.parentNode.insertBefore(
            nodeToBeRemoved.firstChild,
            nodeToBeRemoved
          );
        }
        nodeToBeRemoved.parentNode.removeChild(nodeToBeRemoved);
      }
      document.getElementById("tempSelected").style.backgroundColor = "";
      document.getElementById("tempSelected").style.color = "#000000";
      document.getElementById("tempSelected").style.border =
        "1px solid #a0be56";
      document.getElementById("tempSelected").style.borderRadius = "5px";
      document.getElementById("tempSelected").style.padding = "2px";
      //document.getElementById("tempSelected").style.userSelect = "none";
      document.getElementById("tempSelected").id = idToBe;
    })();
  }

  private shouldColor(i:number) : boolean {
    //console.log("shouldColor: ")
    //console.log(i);
    if(this.annotateTextService.coloredWords.indexOf(i) !== -1) {
      return true;
    }
    return false;
  }

  private colorWords(): void {
    console.log("start")
    this.annotateTextService.coloredWords = [];
    for(let node of this.graphService.nodes){
      if (node.meta.fileHash == this.hashCode(this.displayedText)) {
        let curOffset = 0;
        let idx = 0;
        //console.log("wanted offset: " + node.meta.offset)
        //console.log("len: " + this.dta.length)
        for (let l of this.dta) {
          //console.log("curr offset: " + curOffset)
          if(node.meta.offset == curOffset){
            if (this.dta[idx].str != node.label){
              this.dta.splice(idx+1, node.label.length - 1);
              this.dta[idx].str = node.label
              this.dta[idx].idx = curOffset;

              let j = 0;
              for (let c of this.annotateTextService.coloredWords){
                if (c > curOffset) {
                  this.annotateTextService.coloredWords[j] -= node.label.length - 1;
                }
                j++;
              }

              /*for (let c of this.dta){
                if (c.idx > curOffset) {
                  c.idx += node.label.length - 1;
                }
              }*/
            }
            this.annotateTextService.coloredWords.push(idx);
            console.log("pushing: " + idx);
            break;
          }

          idx += 1;
          curOffset = curOffset + l.str.length;
        }

        let str = "";
        for (let l of this.dta) {
          str = str + "[" + l.str + " : " + l.idx + "], ";  
        }
        console.log(str)

      }

    }
    
  }
}
