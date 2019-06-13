import { Injectable } from '@angular/core';
import { GraphService, GraphDTO } from './graph.service';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import { Node, Edge } from '@swimlane/ngx-graph';

const pluginBackendUrl: string = "http://localhost:9000/api/autograph";

@Injectable({
  providedIn: 'root'
})
export class PluginService {

    private width:number = 100;
    private height:number = 100;
    private color:string = "#D63D62";

    constructor(
        private http: HttpClient,
        private graphService: GraphService
    ) {
    }
    
    public autoAnnotate(text) {

        let nextId = Math.floor(Math.random() * 1000000000);;

        this.getAnnotations(nextId, text)

        .subscribe(graph => {
            
            let graphDTO = this.graphService.getGraphDTO()

            for(var i=0; i < graph.nodes.length; i++){
                
                let node: Node = {
                    dimension: {width: this.width, height: this.height},
                    meta: {
                      forceDimensions: true,
                      color: this.colorLuminance(this.color, this.getRandomArbitrary(-0.2, 0.2)),
                      offset: -1
                    },
                    position:{
                      x: 0,
                      y: 0
                    },
                    id: graph.nodes[i].id.toString(),
                    label: graph.nodes[i].label
                }
                graphDTO.graph.nodes.push(node)
            }

            for(var i=0; i < graph.edges.length; i++){
                
                let nextId = Math.floor(Math.random() * 1000000000);;

                    let edge:Edge = {
                    id: "edge" + (nextId).toString(),
                    source: graph.edges[i].source.toString(),
                    target: graph.edges[i].target.toString(),
                    data: {
                        color: "#3E6158",
                        stroke_width: 2,
                        label: "Edge"
                    }
                    }
                graphDTO.graph.edges.push(edge)
            }


            this.graphService.updateGraph(graphDTO)
        })
    }

    private colorLuminance(hex, lum):string {

        // validate hex string
        hex = String(hex).replace(/[^0-9a-f]/gi, '');
        if (hex.length < 6) {
        hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
        }
        lum = lum || 0;
    
        // convert to decimal and change luminosity
        var rgb = "#", c, i;
        for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i*2,2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00"+c).substr(c.length);
        }
    
        return rgb;
    }

    private getRandomArbitrary(min, max):number {
        return Math.random() * (max - min) + min;
    }

    private getAnnotations(nextId, text): Observable<any> {
  
      var par = {plugin_name:'parts of speech', start_id:nextId };
  
      const httpOptions: object = {
          headers: new HttpHeaders({ "Content-Type": "text/plain" }),
          params: par
      };
  
      const url: string = pluginBackendUrl;
  
      let data = text;
       //"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
      // "The standard Lorem Ipsum passage, used since the 1500 Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Section 1.10.32 of de Finibus Bonorum et Malorum, written by Cicero in 45 BC Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? 1914 translation by H. Rackham But I must explain to you how all this mistaken idea of denouncing pleasure and praising pain was born and I will give you a complete account of the system, and expound the actual teachings of the great explorer of the truth, the master-builder of human happiness. No one rejects, dislikes, or avoids pleasure itself, because it is pleasure, but because those who do not know how to pursue pleasure rationally encounter consequences that are extremely painful. Nor again is there anyone who loves or pursues or desires to obtain pain of itself, because it is pain, but because occasionally circumstances occur in which toil and pain can procure him some great pleasure. To take a trivial example, which of us ever undertakes laborious physical exercise, except to obtain some advantage from it? But who has any right to find fault with a man who chooses to enjoy a pleasure that has no annoying consequences, or one who avoids a pain that produces no resultant pleasure? Section 1.10.33 of de Finibus Bonorum et Malorum, written by Cicero in 45 BC At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat."
      
      return this.http.post<any>(url, data, httpOptions)
    }
}