package com.f4education.springjwt.repository;

import com.f4education.springjwt.models.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswerReposotory extends JpaRepository<Answer, Integer> {

}
