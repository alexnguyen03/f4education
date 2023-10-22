package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.RegisterCourse;

@Repository
public interface RegisterCourseRepository extends JpaRepository<RegisterCourse, Integer> {
    @Query("SELECT rc FROM RegisterCourse rc WHERE rc.student.studentId = :studentId")
    List<RegisterCourse> findByStudentId(@Param("studentId") String studentId);


    @Query("SELECT rc FROM RegisterCourse rc JOIN rc.classes WHERE rc.student.studentId = :studentId")
    List<RegisterCourse> findCourseProgressByStudentId(@Param("studentId") String studentId);
}
