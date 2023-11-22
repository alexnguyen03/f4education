package com.f4education.springjwt.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeacherResultOfStudentResponse {
//	private Classes classes;
	private String studentId;
	private String studentName;
	private String studentImg;
	private Double averagePoint;
	private Double exercisePoint;
	private Double attendancePoint;
	private Double quizzPoint;
}
