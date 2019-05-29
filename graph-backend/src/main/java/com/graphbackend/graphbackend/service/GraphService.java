package com.graphbackend.graphbackend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.graphbackend.graphbackend.dto.GetGraphResponseDTO;
import com.graphbackend.graphbackend.persistence.entity.Graph;
import com.graphbackend.graphbackend.persistence.repository.GraphRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class GraphService {

   private GraphRepository graphRepository;

   @Autowired
   public GraphService(GraphRepository graphRepository) {
      this.graphRepository = graphRepository;
   }

   public GetGraphResponseDTO getGraph(String graphName) {

      Graph graphEntity = graphRepository.findById(graphName).get();

      ObjectMapper mapper = new ObjectMapper();

      JsonNode graph = null;

      try {
         graph = mapper.readTree(graphEntity.getGraphJson());
      } catch (IOException e) {
         e.printStackTrace();
      }

      return new GetGraphResponseDTO(graphEntity.getName(), graph);
   }

   public void saveGraph(String graphName, JsonNode graph) {
////      System.out.println(graph);
//      System.out.println(graph.str());

      graphRepository.save(new Graph(graphName, graph.toString()));
   }
}
