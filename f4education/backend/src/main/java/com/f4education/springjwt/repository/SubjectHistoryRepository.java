package com.f4education.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.SubjectHistory;

@Repository
public interface SubjectHistoryRepository extends JpaRepository<SubjectHistory, Integer> {
	
}
