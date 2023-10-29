package com.f4education.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.f4education.springjwt.models.QuizResult;


public interface QuizResultRepository extends JpaRepository<QuizResult, Integer> {
	
}
