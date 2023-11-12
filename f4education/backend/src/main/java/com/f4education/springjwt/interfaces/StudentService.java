package com.f4education.springjwt.interfaces;

import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.payload.request.StudentDTO;
import com.f4education.springjwt.payload.request.TeacherDTO;

public interface StudentService {
    public Student findByUserId(String userId);
    
    StudentDTO getStudentDTOByID(String studentId);
    
    StudentDTO updateStudent(StudentDTO studentDTO);
}
