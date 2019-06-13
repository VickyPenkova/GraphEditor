import { Injectable } from '@angular/core';
import { GraphService } from './graph.service';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {Observable, Subject} from "rxjs";

const pluginBackendUrl: string = "http://localhost:9000/api/autograph";

@Injectable({
  providedIn: 'root'
})
export class PluginService {

    constructor(
        private http: HttpClient,
        private graphService: GraphService
    ) {
  
  
      this.getAnnotations()
      .subscribe(graph => {
          console.log(graph)
      })
    }
  
    private getAnnotations(): Observable<any> {
  
      var par = {plugin_name:'parts of speech', start_id:'112'};
  
      const httpOptions: object = {
          headers: new HttpHeaders({ "Content-Type": "text/plain" }),
          params: par
      };
  
      const url: string = pluginBackendUrl;
  
      let data = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."
      
      return this.http.post<any>(url, data, httpOptions)
    }
}