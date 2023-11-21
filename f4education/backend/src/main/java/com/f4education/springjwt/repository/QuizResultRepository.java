package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.f4education.springjwt.models.QuizResult;

public interface QuizResultRepository extends JpaRepository<QuizResult, Integer> {
    @Query("SELECT at.student.studentId, COUNT(at.student.studentId) FROM QuizResult AS at WHERE at.classes.classId = :classId GROUP BY at.student.studentId")
    public List<Object[]> getAllByClassId(@Param("classId") Integer classId);
}
