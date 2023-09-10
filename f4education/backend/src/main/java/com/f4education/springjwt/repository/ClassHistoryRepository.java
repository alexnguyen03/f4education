package com.f4education.springjwt.repository;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.f4education.springjwt.models.ClassHistory;
import com.f4education.springjwt.models.Classes;

public interface ClassHistoryRepository extends JpaRepository<ClassHistory, Integer> {
	
}