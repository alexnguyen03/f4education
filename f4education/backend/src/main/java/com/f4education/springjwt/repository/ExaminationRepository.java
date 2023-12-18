package com.f4education.springjwt.repository;

import java.util.Date;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.Examination;

@Repository
public interface ExaminationRepository extends JpaRepository<Examination, Integer> {
    @Query(value = "SELECT  CASE  WHEN  COUNT(Examination.exam_id)> 0 THEN   1 ELSE 0  END  FROM  Examination   WHERE  class_id = :classId", nativeQuery = true)
    public Integer isActivedExam(@Param("classId") Integer classId);

//    @Query(value = "SELECT  CASE  WHEN  COUNT(Examination.exam_id)> 0 THEN   1 ELSE 0  END  FROM  Examination   WHERE  class_id = :classId AND CONVERT(DATE,  Examination.finish_date ) = :today", nativeQuery = true)
//    public Integer isActivedExamByTodayAndClassId(@Param("classId") Integer classId, @Param("today") String today);
    
    @Query(value = "SELECT CASE WHEN COUNT(sc.schedule_id)> 0 THEN 1 ELSE 0 END FROM Schedule sc  WHERE sc.class_id = :classId AND CONVERT(DATE, sc.study_date) = :today AND sc.is_practice IS NULL", nativeQuery = true)
    public Integer isActivedExamByTodayAndClassId(@Param("classId") Integer classId, @Param("today") String today);
    
    @Query(value = "SELECT * FROM Examination WHERE class_id = :classId", nativeQuery = true)
    public Examination getByClassId(@Param("classId") Integer classId);
}