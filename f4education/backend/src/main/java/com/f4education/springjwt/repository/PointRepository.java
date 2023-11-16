package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.Point;

@Repository
public interface PointRepository extends JpaRepository<Point, Integer> {
    @Query("SELECT p FROM Point p WHERE p.classes.classId = :classId")
    public List<Point> findAllByClassId(@Param("classId") Integer classId);

    @Query("SELECT p FROM Point p WHERE p.student.studentId = :studentId AND p.classes.classId = :classId")
	List<Point> findByStudentIdAndCLassId(@Param("studentId") String studentId, @Param("classId") Integer classId);

    @Query("SELECT p FROM Point p WHERE p.student.studentId = :studentId")
    public List<Point> findAllByStudentId(@Param("studentId") String studentId);
}
