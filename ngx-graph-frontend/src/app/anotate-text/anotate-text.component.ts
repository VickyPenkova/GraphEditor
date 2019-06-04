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
  stringArray: String[] = [];
  markedWord: String;
  constructor(private annotateTextService: AnnotateTextService) {}

  ngOnInit() {
    this.annotateTextService.wordsInText.subscribe(e => {
      this.stringArray = e;
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
    return text.trim();
  }

  handleTextSelection(event) {
    this.markedWord = this.getSelectionText();
  }
}
