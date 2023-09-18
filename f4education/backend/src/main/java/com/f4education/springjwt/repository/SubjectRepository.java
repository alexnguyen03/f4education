package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.Subject;

@Repository
public interface SubjectRepository extends JpaRepository<Subject, Integer> {
	@Query("SELECT MAX(s.subjectId) FROM Subject s")
	Integer getMaxSubjectId();

	@Query("SELECT s.subjectName, COUNT(c) FROM Subject s JOIN s.courses c GROUP BY s.subjectName")
	List<Object[]> getCourseCountBySubject();

}
