package com.f4education.springjwt.payload.response;

import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.Course;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CourseProgressResponseDTO {
    private Course course;
    private Classes classes;
    private String teacherName;
}
