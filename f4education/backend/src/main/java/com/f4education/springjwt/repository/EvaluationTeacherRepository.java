package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.EvaluationTeacher;
import com.f4education.springjwt.payload.response.EvaluationTeacherResponse;

@Repository
public interface EvaluationTeacherRepository extends JpaRepository<EvaluationTeacher, Integer> {
    @Query("select et from EvaluationTeacher et where et.classes.classId= :classId")
    public List<EvaluationTeacher> getAllEvaluationTeacherByClassId(@Param("classId") Integer classId);

    @Query(value = "SELECT  ed.title,   COUNT(value), ed.value   FROM Class c JOIN EvaluationTeacher et ON c.class_id = et.class_id JOIN EvaluationTeacherDetail ed ON et.evaluation_id = ed.evaluate_teacher_id where  c.teacher_id =:teacherId GROUP BY  ed.title, ed.value ORDER BY ed.title ASC", nativeQuery = true)
    public List<Object[]> getAllEvaluationsByTeacherId(@Param("teacherId") String teacherId);

    @Query(value = "SELECT  ed.title,tc.teacher_id, c.class_id,   COUNT(ed.value) AS 'vote', ed.value   FROM Class c JOIN EvaluationTeacher et ON c.class_id = et.class_id  JOIN EvaluationTeacherDetail ed ON et.evaluation_id = ed.evaluate_teacher_id JOIN Teacher tc ON tc.teacher_id = c.teacher_id  GROUP BY  ed.title, ed.value  ,tc.teacher_id, c.class_id ORDER BY ed.title ASC", nativeQuery = true)
    public List<Object[]> getAllReportEvaluationTeacher();

    @Query(value = "SELECT COUNT(e.evaluationId) FROM  EvaluationTeacher e WHERE e.classes.classId =:classId AND e.student.studentId=:studentId    ")
    public Integer checkStudentHasEvaluated(@Param("classId") Integer classId, @Param("studentId") String studentId);

}
