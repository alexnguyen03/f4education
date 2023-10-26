package com.f4education.springjwt.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.f4education.springjwt.models.Classes;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassRepository extends JpaRepository<Classes, Integer> {

    @Query("SELECT c FROM Classes c WHERE c.teacher.teacherId = :teacherId")
    List<Classes> findClassesByTeacherId(@Param("teacherId") String teacherId);

    @Query("SELECT c FROM Classes c WHERE c.teacher.teacherId <> 'NULL' and c.status = 'Đang chờ'")
    public List<Classes> findAllActiveClasses();
}
