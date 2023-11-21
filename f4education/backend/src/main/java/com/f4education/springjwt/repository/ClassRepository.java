package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.Classes;

@Repository
public interface ClassRepository extends JpaRepository<Classes, Integer> {

	@Query("SELECT c FROM Classes c WHERE c.teacher.teacherId = :teacherId")
	List<Classes> findClassesByTeacherId(@Param("teacherId") String teacherId);

	@Query("SELECT c FROM Classes c WHERE c.teacher.teacherId <> 'NULL' and c.status = 'Đang chờ'")
	List<Classes> findAllActiveClasses();

	@Query("SELECT c FROM Classes c WHERE c.teacher.teacherId <> 'NULL' and	c.classId = :classId")
	Classes findAllActiveClassesByClassId(@Param("classId") Integer classId);

	@Query("SELECT cl FROM Classes cl JOIN cl.registerCourses rg WHERE rg.student.studentId = :studentId")
	List<Classes> findClassByStudentId(@Param("studentId") String studentId);

	// Truy vấn JPQL để lấy danh sách lớp học với thông tin sinh viên và điểm của mỗi sinh viên
    @Query("SELECT DISTINCT c FROM Classes c JOIN FETCH c.points p JOIN FETCH p.student s WHERE c.classId = :classId")
    List<Classes> getClassWithStudentsAndPoints(@Param("classId") Integer classId);
}
