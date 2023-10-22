package com.f4education.springjwt.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.f4education.springjwt.models.Resources;

public interface ResourceRepository extends JpaRepository<Resources, Integer> {
	
}
