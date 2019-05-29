package com.graphbackend.graphbackend.persistence.entity;

import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class Graph {

   @Id
   private String name;

   @Column(columnDefinition = "TEXT")
   private String  graphJson;
}
