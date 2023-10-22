package com.f4education.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.f4education.springjwt.models.Classes;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ClassRepository extends JpaRepository<Classes, Integer> {

    @Query("SELECT c FROM Classes c WHERE c.teacher.teacherId = :teacherId")
    List<Classes> findClassesByTeacherId(@Param("teacherId") String teacherId);
}
