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
  markedId: String;
  nodeLabelDict = {};
  nodeWordIdDict = new Map();
  constructor(private annotateTextService: AnnotateTextService) {}

  ngOnInit() {
    this.displayedText.toString();

    this.annotateTextService.wordsInText.subscribe(e => {
      this.arrayOfWordsInText = e;
      var inserHere = document.getElementById("anchor");
      //insert spans with each word in text after the anchor
      //each span has the id of the corresponding number of the word in the text
      e.forEach(function(k, i) {
        var newItem = document.createElement("span");
        newItem.innerHTML = k.toString();
        inserHere.appendChild(newItem);
        newItem.setAttribute("node-attached", "none");
        newItem.setAttribute("id", i.toString());
        //insret id-less spans with space
        newItem = document.createElement("span");
        newItem.innerHTML = "&nbsp";
        inserHere.appendChild(newItem);
      });
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
    while (document.getElementById("anchor").firstChild) {
      document
        .getElementById("anchor")
        .removeChild(document.getElementById("anchor").firstChild);
    }
  }
  //get selected text
  getSelectionText() {
    var text = "";
    if (window.getSelection) {
      text = window.getSelection().toString();
    } else if (
      document.getSelection() &&
      document.getSelection().type != "Control"
    ) {
      text = document.getSelection().toString();
    }
    return text;
  }

  handleTextSelection(event) {
    this.markedWord = this.getSelectionText();
    this.markedId = event.target.id;
  }

  changeTextOfNode(event) {
    var selectedNodeID = event.target.id;
    event.target.innerHTML = this.markedWord.toString();
    this.nodeLabelDict[selectedNodeID] = this.markedWord.toString();
    var that = this;
    (function() {
      console.log(
        "Does the dic have " +
          selectedNodeID +
          " -> " +
          that.nodeWordIdDict[selectedNodeID]
      );
      console.log(
        "What we have in the dic : " + that.nodeWordIdDict[selectedNodeID]
      );
      if (that.nodeWordIdDict[selectedNodeID] !== undefined) {
        console.log("We have already a word for " + selectedNodeID);
        console.log("I am in");
        console.log(
          "The id of the word is " +
            document.getElementById(that.nodeWordIdDict[selectedNodeID])
        );
        document
          .getElementById(that.nodeWordIdDict[selectedNodeID])
          .classList.remove("used");
      }
      console.log(
        "Adding word to nodeid " +
          selectedNodeID +
          " with wordid " +
          that.markedId
      );
      that.nodeWordIdDict[selectedNodeID] = that.markedId;
      document.getElementById(that.markedId.toString()).classList.add("used");
      console.log("What we have in the dic after adding : ");
      console.log(that.nodeWordIdDict);
      console.log("------------End------------");
    })();
  }
}
