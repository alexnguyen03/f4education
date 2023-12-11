package com.f4education.springjwt.interfaces;

import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.payload.request.ClassDTO;
import com.f4education.springjwt.payload.response.ClassesByTeacherResponse;
import com.f4education.springjwt.payload.response.LearningResultResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface ClassService {
	List<ClassDTO> findAll();

	ClassDTO getClassById(Integer classId);

	List<ClassesByTeacherResponse> getAllClassesByTeacherId(String teacherId);

	List<ClassDTO> findAllActiveClasses();

	List<Classes> getClassByStudentId(String studentId);

	ClassDTO createClass(ClassDTO classDTO, String adminId);

	ClassDTO updateClass(Integer classId, ClassDTO classDTO);

	Classes saveOneClass(Classes classes);

	Classes findById(Integer classId);

	List<LearningResultResponse> getAllClassLearningResult(String studentId);
}
