package com.f4education.springjwt.interfaces;

import java.util.List;

import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.payload.request.ClassDTO;
import com.f4education.springjwt.payload.response.ClassesByTeacherResponse;

public interface ClassService {
	List<ClassDTO> findAll();

	ClassDTO getClassById(Integer classId);

	List<ClassesByTeacherResponse> getAllClassesByTeacherId(String teacherId);

	ClassDTO createClass(ClassDTO classDTO);

	ClassDTO updateClass(Integer classId, ClassDTO classDTO);
}
