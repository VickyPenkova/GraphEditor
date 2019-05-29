package com.graphbackend.graphbackend.controller;


import com.fasterxml.jackson.databind.JsonNode;
import com.graphbackend.graphbackend.dto.GetGraphResponseDTO;
import com.graphbackend.graphbackend.service.GraphService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController(GraphController.GRAPH_API_PATH)
public class GraphController {

   static final String GRAPH_API_PATH = "/api/v1/graphs";

   private GraphService graphService;

   @Autowired
   public GraphController(GraphService graphService) {
      this.graphService = graphService;
   }

   @GetMapping
   public GetGraphResponseDTO getGraph(@RequestParam String graphName) {
      return graphService.getGraph(graphName);
   }

   @GetMapping(params={"!graphName"})
   public List<GetGraphResponseDTO> listGraphs() {
      return graphService.listGraphs();
   }

   @PostMapping
   public void saveGraph(@RequestParam String graphName, @RequestBody JsonNode graph) {
      graphService.saveGraph(graphName, graph);
   }
}
