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
export class IndexedWord {
  str: String;
  idx: number;
}

@Injectable({
  providedIn: "root"
})
export class AnnotateTextService {
  private _wordsInText: IndexedWord [] = []
  //private _wordsInTextObservable: Subject<IndexedWord[]> = new Subject<IndexedWord[]>();

  private _cl: boolean = false;
  private _clicked: Subject<boolean> = new Subject<boolean>();

  private _coloredWords: number[] = [];

  _words:String = "";
  _wordsObservable:Subject<String> = new Subject<String>();

  constructor() {}

  setWords(words: string): void {
    let wordsArr = words.split("");
    let indexedWordsArr: IndexedWord[] = []

    let i = 0;
    for(let word of wordsArr) {
      let indexedWord: IndexedWord = new IndexedWord();
      indexedWord.str = word;
      indexedWord.idx = i;

      indexedWordsArr.push(indexedWord);

      i+=word.length;
    }

    this._words = words;
    this._wordsInText = indexedWordsArr;
    this._wordsObservable.next(words);

    //alert(this._wordsInText)
    //this._wordsInTextObservable.next(indexedWordsArr);
  }

  //get wordsInTextObservable(): Subject<IndexedWord[]> {
    // console.log(this._wordsInTextObservable);
  //  return this._wordsInTextObservable;
 // }

  click(): void {
    this._cl = !this._cl;
    this._clicked.next(this._cl);
  }

  get clicked(): Subject<boolean> {
    return this._clicked;
  }

  get wordsInText(): IndexedWord [] {
    return this._wordsInText
  }

  set wordsInText(words:IndexedWord []) {
    this._wordsInText = words;
  }

  get coloredWords(): number[] {
    return this._coloredWords;
  }

  set coloredWords(cw : number[]) {
    this._coloredWords = cw;
  }

  //updateWordsInTextObservable(ddta) {
  //  this.wordsInTextObservable.next(ddta);
 // }

}
