package com.f4education.springjwt.payload.response;

import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.Student;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClassesByTeacherResponse {
    private Classes classes;
    // private List<RegisterCourse> registerCourses;
    private List<String> courseName;
    private List<Student> students;
}
