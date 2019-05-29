package com.graphbackend.graphbackend.persistence.repository;

import com.graphbackend.graphbackend.persistence.entity.Graph;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GraphRepository extends CrudRepository<Graph, String> {
}
