import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { splitClasses } from "@angular/compiler";

/*
let a ={
  "name": "graph-x",
  "nodes": [
    {
      "label": "hi",
      "data": {
        "offset": 4,
        "file": "123210j01d12dj21dj1j12j123asd"
      }
    }
  ]
}*/

@Injectable({
  providedIn: "root"
})
export class AnnotateTextService {
  private _wordsInText: Subject<String[]> = new Subject<String[]>();

  private _cl: boolean = false;
  private _clicked: Subject<boolean> = new Subject<boolean>();

  constructor() {}

  setWords(words: string): void {
    this._wordsInText.next(words.split(" "));
  }

  get wordsInText(): Subject<String[]> {
    // console.log(this._wordsInText);
    return this._wordsInText;
  }

  click(): void {
    this._cl = !this._cl;
    this._clicked.next(this._cl);
  }

  get clicked(): Subject<boolean> {
    return this._clicked;
  }
}
