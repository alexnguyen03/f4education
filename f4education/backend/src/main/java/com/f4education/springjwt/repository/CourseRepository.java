package com.f4education.springjwt.repository;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.query.FluentQuery.FetchableFluentQuery;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.payload.request.ReportCourseCountStudentCertificateDTO;
import com.f4education.springjwt.payload.request.ReportCourseCountStudentDTO;
import com.f4education.springjwt.models.CourseDetail;

@Repository
@EnableJpaRepositories
public interface CourseRepository extends JpaRepository<Course, Integer> {
	List<Course> findAllByAdmin_AdminId(String adminId);

	List<Course> findAllByCourseName(String courseName);

	List<Course> findAllByStatus(Boolean status);

	@Query("SELECT c FROM Course c JOIN c.subject s WHERE s.subjectName IN (:subjectNames)")
	List<Course> findBySubjectNames(@Param("subjectNames") List<String> subjectNames);

	@Query("SELECT c FROM Course c where c.courseName LIKE %:courseName%")
	List<Course> isCourseNameExist(@Param("courseName") String courseName);

	@Query("SELECT k FROM Course k WHERE k.courseDuration >= :minThoiLuong AND k.courseDuration <= :maxThoiLuong")
	List<Course> findByThoiLuongInRange(@Param("minThoiLuong") Integer minThoiLuong,
			@Param("maxThoiLuong") Integer maxThoiLuong);

	@Query("SELECT c FROM Course c JOIN c.registerCourses r ON c.courseId = r.course.courseId JOIN r.student s ON s.studentId = r.student.studentId "
			+ "WHERE s.studentId IN :studentId AND r.classes.classId IS NULL")
	List<Course> findByStudentId(@Param("studentId") String studentId);

	@Query("SELECT c FROM Course c WHERE c.status = :status ORDER BY c.courseId DESC LIMIT 10")
	List<Course> findTop10LatestCourses(Boolean status);

	@Query(value = "SELECT TOP 10 c.*, bd.* FROM Course c "
			+ "JOIN (SELECT b.course_id, b.bill_id ,b.create_date, SUM(b.total_price) AS total_sales "
			+ "FROM Bill b GROUP BY b.course_id, b.bill_id, b.create_date) bd ON c.course_id = bd.course_id "
			+ "WHERE c.status = :status ORDER BY bd.total_sales DESC", nativeQuery = true)
	List<Object[]> findTop10CoursesWithBillDetails(Boolean status);

	@Query("SELECT c FROM Course c JOIN c.subject s WHERE s.subjectName =:subjectName")
	List<Course> getCourseBySubjectName(@Param("subjectName") String subjectName);

	// @Query("SELECT new
	// com.f4education.springjwt.payload.request.ReportCourseCountStudentDTO(c.courseName,
	// COUNT(rc.student.studentId)) "
	// + "FROM Course c " + "JOIN RegisterCourse rc ON c.courseId =
	// rc.course.courseId "
	// + "WHERE LOWER(rc.status) = LOWER(:status) " + "GROUP BY c.courseId,
	// c.courseName")
	// List<ReportCourseCountStudentDTO> getCoursesWithStudentCount(@Param("status")
	// String status);

	@Query("SELECT c FROM Course c JOIN RegisterCourse rc ON c.courseId = rc.course.courseId "
			+ "GROUP BY c")
	List<Course> getAll();

	@Query("SELECT new com.f4education.springjwt.payload.request.ReportCourseCountStudentCertificateDTO(c.courseName, COUNT(DISTINCT p.student.studentId), cl.endDate) "
			+ "FROM Course c " + "JOIN RegisterCourse rc ON c.courseId = rc.course.courseId "
			+ "JOIN Classes cl ON cl.classId = rc.classes.classId " + "JOIN Point p ON p.classes.classId = cl.classId "
			+ "WHERE p.averagePoint >= :mark " + "GROUP BY c.courseName, cl.endDate")
	List<ReportCourseCountStudentCertificateDTO> getCoursesWithStudentCountCertificate(@Param("mark") Double mark);

	List<Course> findAllBySubject_SubjectName(String subjectName);// using DSL syntax
	// @Query("SELECT c.courseDetail FROM Course c where
	// c.registerCourses.classes.classId =:classId")

	@Query("SELECT c.courseDetail FROM Course c  WHERE c.courseId =:courseId")
	List<CourseDetail> getAllCourseContentByCourseId(@Param("courseId") Integer courseId);
}
