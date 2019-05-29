package com.graphbackend.graphbackend.controller;


import com.fasterxml.jackson.databind.JsonNode;
import com.graphbackend.graphbackend.dto.GetGraphResponseDTO;
import com.graphbackend.graphbackend.service.GraphService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController(value = GraphController.GRAPH_API_PATH)
public class GraphController {

   static final String GRAPH_API_PATH = "api/graph";

   private GraphService graphService;

   @Autowired
   public GraphController(GraphService graphService) {
      this.graphService = graphService;
   }

   @GetMapping
   public GetGraphResponseDTO getGraph(@RequestParam String graphName) {
      return graphService.getGraph(graphName);
   }

   @PostMapping
   public void saveGraph(@RequestParam String graphName, @RequestBody JsonNode graph) {
      graphService.saveGraph(graphName, graph);
   }


}
