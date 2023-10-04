package com.f4education.springjwt.interfaces;

import java.util.List;

import com.f4education.springjwt.models.Teacher;
import com.f4education.springjwt.payload.request.TeacherDTO;

public interface TeacherService {
    List<TeacherDTO> getAllTeachersDTO();

    TeacherDTO getTeacherDTOByID(String teacherId);

    TeacherDTO createTeacher(TeacherDTO teacherDTO);

    TeacherDTO updateTeacher(TeacherDTO teacherDTO);

    Teacher findByUserId(String userId);
}
