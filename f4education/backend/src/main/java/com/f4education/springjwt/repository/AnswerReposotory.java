package com.f4education.springjwt.repository;

import com.f4education.springjwt.models.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnswerReposotory extends JpaRepository<Answer, Integer> {
    @Query("SELECT a FROM Answer a WHERE a.questionDetail.questionDetailId = :questionDetailId")
    List<Answer> getAllAnswerByQuestionDetailId(@Param("questionDetailId") Integer questionDetailId);
}
