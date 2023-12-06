package com.f4education.springjwt.payload.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceStudentReviewResponse {
	private Integer attendanceId;
	private Date attendanceDate;
	private Integer classId;
	private String className;
	private String courseName;
}
