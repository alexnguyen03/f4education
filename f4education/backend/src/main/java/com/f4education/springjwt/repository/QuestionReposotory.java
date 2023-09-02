package com.f4education.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.Question;

@Repository
public interface QuestionReposotory extends JpaRepository<Question, Integer> {

}
