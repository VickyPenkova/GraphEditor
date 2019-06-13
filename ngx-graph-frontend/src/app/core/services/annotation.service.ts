import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { GraphService } from './graph.service';

@Injectable({
  providedIn: 'root'
})
export class AnnotationService {

  private _text:string = "";
  private _textObservable:Subject<string> = new Subject<string>();
  //private _originalFiles:Map<string,string> = new Map<string,string>();
  private _originalFiles = {}

  hash:string;

  constructor(private graphService:GraphService) {
    this.graphService._filesObservable.subscribe( fs => {
      console.log(fs)

      this._text = fs[this.hash];
      this._textObservable.next(this._text)
    })

    this.graphService.currentGraphObservable.subscribe(cg => {
      let foundHash:boolean = false;
      let fls =
         this.graphService._files[this.graphService.graphs[this.graphService.currentGraph].name.toString()];
      if (fls !== undefined) {
        let f: string = fls[this.hash];
        if (f !== undefined) {
          this._text = f;
          foundHash = true
        }
      }
      
      if(!foundHash){
        let originalFile:string = this._originalFiles[this.hash];
        this._text = originalFile === undefined ?"":originalFile;
      }
      this._textObservable.next(this._text);
    })
  }

  set text(text:string) {
    this.hash = this.hashCode(text);
    this._originalFiles[this.hash] = text;

    let foundHash:boolean = false;
    let fls = 
        this.graphService._files[this.graphService.graphs[this.graphService.currentGraph].name.toString()];
    if (fls !== undefined) {
      let f: string = fls[this.hash];

      if (f !== undefined) {
        console.log("Found hash of previously annotated text.")
        this._text = f;
        foundHash = true;
      }
    }

    if(!foundHash){
      console.log("Couldn't find hash: " + this.hash)
      this._text = text;
    }

    this._textObservable.next(this._text);
  }

  get text():string {
    return this._text;
  }

  get textObservable():Subject<string>{
    return this._textObservable;
  }

  private hashCode(str):string {
    return str.split('').reduce((prevHash, currVal) =>
      (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
  }
}
