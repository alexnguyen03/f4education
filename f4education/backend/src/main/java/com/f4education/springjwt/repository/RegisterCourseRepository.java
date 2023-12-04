package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.RegisterCourse;
import com.f4education.springjwt.payload.request.ProgressDTO;

@Repository
public interface RegisterCourseRepository extends JpaRepository<RegisterCourse, Integer> {
	@Query("SELECT rc FROM RegisterCourse rc WHERE rc.student.studentId = :studentId")
	List<RegisterCourse> findByStudentId(@Param("studentId") String studentId);

	@Query("SELECT rc FROM RegisterCourse rc WHERE rc.course.courseId = :courseId")
	List<RegisterCourse> findByCourseId(@Param("courseId") Integer courseId);

	@Query("SELECT rc FROM RegisterCourse rc JOIN rc.classes WHERE rc.student.studentId = :studentId")
	List<RegisterCourse> findCourseProgressByStudentId(@Param("studentId") String studentId);

	@Query("SELECT rc FROM RegisterCourse rc WHERE rc.classes.classId is null")
	List<RegisterCourse> findAllNotHasClass();

	@Query("SELECT rc FROM RegisterCourse rc WHERE rc.classes.classId = :classId")
	List<RegisterCourse> getRegisterCourseHasClass(@Param("classId") Integer classId);

	@Query("SELECT new com.f4education.springjwt.payload.request.ProgressDTO(rc) FROM RegisterCourse rc WHERE rc.classes.classId = :classId")
	List<ProgressDTO> getAllProgress(@Param("classId") Integer classId);

	//
	// @Query("SELECT new com.f4education.springjwt.models.ClassesByTeacher(rc,c,t)
	// FROM RegisterCourse rc JOIN rc.classes c JOIN c.teacher t")
	// List<ClassesByTeacher> getRegisterCourseWithTeacherAndClasses();
	List<RegisterCourse> findRegisterCoursesByStudent_StudentId(String studentId);

	@Query("SELECT rg FROM RegisterCourse rg JOIN rg.classes c JOIN c.points p "
			+ "WHERE rg.student.studentId = :studentId AND c.classId = :classId AND "
			+ "rg.registerCourseId = :registerCourseId AND p.averagePoint > :averagePoint")
	RegisterCourse findIfCourseIsDone(@Param("studentId") String studentId, @Param("classId") Integer classId,
			@Param("registerCourseId") Integer registerCourseId, @Param("averagePoint") Float averagePoint);

	public List<RegisterCourse> findAllByClasses_ClassId(Integer classId);

}
