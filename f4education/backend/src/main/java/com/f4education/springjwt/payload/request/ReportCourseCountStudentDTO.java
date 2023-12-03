package com.f4education.springjwt.payload.request;

import java.util.Date;
import java.util.List;

public class ReportCourseCountStudentDTO {
	private String courseName;
	private Long studentCount;
	private List<Date> registrationDates;

	public ReportCourseCountStudentDTO(String courseName, Long studentCount, List<Date> registrationDates) {
		this.courseName = courseName;
		this.studentCount = studentCount;
		this.registrationDates = registrationDates;
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

	public List<Date> getRegistrationDates() {
		return registrationDates;
	}

	public void setRegistrationDates(List<Date> registrationDates) {
		this.registrationDates = registrationDates;
	}

	@Override
	public String toString() {
		return "ReportCourseCountStudentDTO [courseName=" + courseName + ", studentCount=" + studentCount
				+ ", registrationDates=" + registrationDates + "]";
	}
}
