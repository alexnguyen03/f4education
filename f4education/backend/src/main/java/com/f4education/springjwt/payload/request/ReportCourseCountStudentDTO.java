package com.f4education.springjwt.payload.request;

import java.util.Date;
import java.util.List;

public class ReportCourseCountStudentDTO {
	private String courseName;
	private Long studentCount;
	// private Date registrationDate;

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

	public ReportCourseCountStudentDTO(String courseName, Long studentCount, Date registrationDate) {
		super();
		this.courseName = courseName;
		this.studentCount = studentCount;
	}

	public ReportCourseCountStudentDTO(String courseName2, Long studentCount2) {
	}

	@Override
	public String toString() {
		return "ReportCourseCountStudentDTO [courseName=" + courseName + ", studentCount=" + studentCount + "]";
	}
}
