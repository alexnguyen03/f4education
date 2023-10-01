package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.QuestionDetail;

@Repository
public interface QuestionDetailReposotory extends JpaRepository<QuestionDetail, Integer> {

    //  List những câu hoỉ không trùng lập courseName
    @Query("SELECT q FROM QuestionDetail q WHERE q.questionDetailId IN (" +
            "SELECT MIN(q2.questionDetailId) FROM QuestionDetail q2 WHERE q2.courseName " +
            "IS NOT NULL GROUP BY q2.courseName)")
    List<QuestionDetail> findDistinctByCourseName();


    @Query("SELECT q FROM QuestionDetail q WHERE q.courseName = :courseName")
    List<QuestionDetail> findByCourseName(String courseName);

    @Query("SELECT MAX(q.questionDetailId) FROM QuestionDetail q")
    Integer getMaxQuestionId();
}
