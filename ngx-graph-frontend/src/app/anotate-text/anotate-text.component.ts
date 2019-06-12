import { Component, OnInit } from "@angular/core";
import { AnnotateTextService } from "../core/services/annotate-text.service";
import * as $ from "jquery";
import { checkAndUpdateTextDynamic } from "@angular/core/src/view/text";

@Component({
  selector: "app-anotate-text",
  templateUrl: "./anotate-text.component.html",
  styleUrls: ["./anotate-text.component.css"]
})
export class AnotateTextComponent implements OnInit {
  arrayOfWordsInText: String[] = [];
  displayedText: String = "";
  markedWord: String;
  nodeLabelDict = {};
  constructor(private annotateTextService: AnnotateTextService) {}

  ngOnInit() {
    this.annotateTextService.wordsInText.subscribe(e => {
      this.arrayOfWordsInText = e;
      this.displayedText = this.arrayOfWordsInText.join(" ");
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

    $(".simulate p").click(this.changeTextOfNode);
  }

  //read the uploaded file
  changeOfFile(event) {
    //read the file content
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
      var start = text.anchorOffset;
      var end = text.focusOffset - text.anchorOffset;

      var range = window.getSelection().getRangeAt(0);

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
    return text;
  }

  handleTextSelection(event) {
    this.markedWord = this.getSelectionText().toString();
  }

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
      document.getElementById("tempSelected").style.backgroundColor = "#282828";
      document.getElementById("tempSelected").style.color = "#a0be56";
      document.getElementById("tempSelected").style.borderRadius = "5px";
      document.getElementById("tempSelected").style.padding = "2px";
      document.getElementById("tempSelected").style.userSelect = "none";
      document.getElementById("tempSelected").id = idToBe;
    })();
  }
}
