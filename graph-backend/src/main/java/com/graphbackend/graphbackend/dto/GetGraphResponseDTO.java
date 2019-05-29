package com.graphbackend.graphbackend.dto;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
public class GetGraphResponseDTO {

   private String name;

   private JsonNode graph;
}
