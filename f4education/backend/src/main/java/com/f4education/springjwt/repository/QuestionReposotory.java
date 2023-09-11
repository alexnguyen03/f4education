package com.f4education.springjwt.repository;

import com.f4education.springjwt.payload.request.QuestionDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.Question;

import java.util.List;

@Repository
public interface QuestionReposotory extends JpaRepository<Question, Integer> {

    //  List những câu hoỉ không trùng lập courseName
    @Query("SELECT q FROM Question q WHERE q.questionId IN (" +
            "SELECT MIN(q2.questionId) FROM Question q2 WHERE q2.courseName " +
            "IS NOT NULL GROUP BY q2.courseName)")
    List<Question> findDistinctByCourseName();


    @Query("SELECT q FROM Question q WHERE q.courseName = :courseName")
    List<Question> findByCourseName(String courseName);
}
