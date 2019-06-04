import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class AnnotateTextService {
  private _wordsInText: Subject<String[]> = new Subject<String[]>();
  constructor() {}

  setWords(words: string): void {
    this._wordsInText.next(words.split(" "));
  }

  get wordsInText(): Subject<String[]> {
    // console.log(this._wordsInText);
    return this._wordsInText;
  }
}
