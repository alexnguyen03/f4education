package com.f4education.springjwt.repository;

import java.util.List;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.Course;

public interface CourseRepository extends JpaRepository<Course, Integer> {
	List<Course> findAllByAdmin_AdminId(String adminId);

	List<Course> findAllByCourseName(String courseName);

	@Query("SELECT c FROM Course c JOIN c.subject s WHERE s.subjectName IN (:subjectNames)")
	List<Course> findBySubjectNames(@Param("subjectNames") List<String> subjectNames);

	@Query("SELECT k FROM Course k WHERE k.courseDuration >= :minThoiLuong AND k.courseDuration <= :maxThoiLuong")
	List<Course> findByThoiLuongInRange(@Param("minThoiLuong") Integer minThoiLuong,
			@Param("maxThoiLuong") Integer maxThoiLuong);

	@Query("SELECT c FROM Course c JOIN c.registerCourses r ON c.courseId = r.course.courseId JOIN r.student s ON s.studentId = r.student.studentId "
			+ "WHERE s.studentId IN :studentId AND r.classes.classId IS NULL")
	List<Course> findByStudentId(@Param("studentId") String studentId);

	@Query("SELECT c FROM Course c ORDER BY c.courseId DESC LIMIT 10")
	List<Course> findTop10LatestCourses();

//	@Query("SELECT c FROM Course c JOIN c.billDetail bd GROUP BY c.courseId,c.admin.adminId "
//			+ "c.courseDescription")
//	List<Course> findTopSellingCourses();

	@Query("SELECT c FROM Course c JOIN c.subject s WHERE s.subjectName = :subjectName")
	List<Course> getCourseBySubjectName(@Param("subjectName") String subjectName);

}
