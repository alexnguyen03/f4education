package com.f4education.springjwt.payload.request;

import java.util.Date;
import java.util.List;

import com.f4education.springjwt.models.RegisterCourse;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.models.Teacher;
import com.f4education.springjwt.payload.response.RegisterCourseResponseDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClassDTO {
	private Integer classId;
	private String className;
	private String courseName;
	private Date startDate;
	private Date endDate;
	private Integer maximumQuantity;
	private String status;
	private AdminDTO admin;
	private List<RegisterCourse> registerCourses;
	private List<Student> students;
	private Teacher teacher;
	private Integer courseId;

}
