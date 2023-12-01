package com.f4education.springjwt.payload.request;

import java.util.Date;

public class ReportCourseCountStudentDTO {
	private String courseName;
	private Long studentCount;
//	private Date registrationDate;

	public ReportCourseCountStudentDTO(String courseName, Long studentCount) {
		super();
		this.courseName = courseName;
		this.studentCount = studentCount;
//		this.registrationDate = registrationDate;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public Long getStudentCount() {
		return studentCount;
	}

	public void setStudentCount(Long studentCount) {
		this.studentCount = studentCount;
	}

//	public Date getRegistrationDate() {
//		return registrationDate;
//	}
//
//	public void setRegistrationDate(Date registrationDate) {
//		this.registrationDate = registrationDate;
//	}

	@Override
	public String toString() {
		return "ReportCourseCountStudentDTO [courseName=" + courseName + ", studentCount=" + studentCount
				+"]";
	}
}
