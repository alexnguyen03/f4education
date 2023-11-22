package com.f4education.springjwt.payload.request;

import java.util.Date;

import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.Student;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuizResultDTO {
	private Integer quizzId;

	private Integer score;

	private Integer duration;
	
	private Date quizzDate;
	
	private Course course;
	
	private Classes classes;
	
	private Student student;
}
