package com.graphbackend.graphbackend.controller;


import com.fasterxml.jackson.databind.JsonNode;
import com.graphbackend.graphbackend.dto.GetGraphResponseDTO;
import com.graphbackend.graphbackend.service.GraphService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class GraphController {

   private GraphService graphService;

   @Autowired
   public GraphController(GraphService graphService) {
      this.graphService = graphService;
   }

   @GetMapping(value = "/api/v1/graphs/{graphName}")
   public GetGraphResponseDTO getGraph(@PathVariable String graphName) {
      return graphService.getGraph(graphName);
   }

   @GetMapping(value = "/api/v1/graphs")
   public List<GetGraphResponseDTO> listGraphs() {
      return graphService.listGraphs();
   }

   @PostMapping(value = "/api/v1/graphs")
   public void saveGraph(@RequestParam String graphName, @RequestBody JsonNode graph) {
      graphService.saveGraph(graphName, graph);
   }
}
