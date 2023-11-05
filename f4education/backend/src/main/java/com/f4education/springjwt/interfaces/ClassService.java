package com.f4education.springjwt.interfaces;

import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.payload.request.ClassDTO;
import com.f4education.springjwt.payload.response.ClassesByTeacherResponse;

import java.util.List;

public interface ClassService {
	List<ClassDTO> findAll();

	ClassDTO getClassById(Integer classId);

	List<ClassesByTeacherResponse> getAllClassesByTeacherId(String teacherId);

	List<ClassDTO> findAllActiveClasses();

	List<Classes> getClassByStudentId(String studentId);

	ClassDTO createClass(ClassDTO classDTO);

	ClassDTO updateClass(Integer classId, ClassDTO classDTO);

	Classes findById(Integer classId);
}
