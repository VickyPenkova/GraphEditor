package com.graphbackend.graphbackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.graphbackend.graphbackend.dto.GetGraphResponseDTO;
import com.graphbackend.graphbackend.persistence.entity.Graph;
import com.graphbackend.graphbackend.persistence.repository.GraphRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Service
public class GraphService {

   private GraphRepository graphRepository;

   @Autowired
   public GraphService(GraphRepository graphRepository) {
      this.graphRepository = graphRepository;
   }

   public GetGraphResponseDTO getGraph(String graphName) {

      Graph graphEntity = graphRepository.findById(graphName).get();

      JsonNode graph = deserializeGraph(graphEntity.getGraphJson());

      return new GetGraphResponseDTO(graphEntity.getName(), graph);
   }

   public void saveGraph(String graphName, JsonNode graph) {

      graphRepository.save(new Graph(graphName, graph.toString()));
   }

   public List<GetGraphResponseDTO> listGraphs() {

      Iterable<Graph> graphs = graphRepository.findAll();

      List<GetGraphResponseDTO> graphResponseDTOS = new ArrayList<>();

      for (Graph g : graphs) {
         graphResponseDTOS.add(new GetGraphResponseDTO(g.getName(), deserializeGraph(g.getGraphJson())));
      }

      return graphResponseDTOS;
   }

   private JsonNode deserializeGraph(String graph) {
      JsonNode jsonGraph = null;
      ObjectMapper mapper = new ObjectMapper();

      try {
         jsonGraph = mapper.readTree(graph);
      } catch (IOException e) {
         e.printStackTrace();
      }
      return jsonGraph;
   }
}
