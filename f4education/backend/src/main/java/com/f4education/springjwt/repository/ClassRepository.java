package com.f4education.springjwt.repository;

import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.Point;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassRepository extends JpaRepository<Classes, Integer> {

	@Query("SELECT c FROM Classes c WHERE c.teacher.teacherId = :teacherId")
	List<Classes> findClassesByTeacherId(@Param("teacherId") String teacherId);

	@Query("SELECT c FROM Classes c WHERE c.teacher.teacherId <> 'NULL' and c.status = 'Đang chờ'")
	List<Classes> findAllActiveClasses();

	@Query("SELECT c FROM Classes c WHERE c.teacher.teacherId <> 'NULL' and	c.classId = :classId")
	Classes findAllActiveClassesByClassId(@Param("classId") Integer classId);

}
