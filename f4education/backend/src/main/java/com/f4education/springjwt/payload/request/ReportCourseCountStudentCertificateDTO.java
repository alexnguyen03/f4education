package com.f4education.springjwt.payload.request;

import java.util.Date;

public class ReportCourseCountStudentCertificateDTO {
	private String courseName;
    private Long certificateCount;
    private Date certificateDate;
    
    
	public ReportCourseCountStudentCertificateDTO(String courseName, Long certificateCount, Date certificateDate) {
		super();
		this.courseName = courseName;
		this.certificateCount = certificateCount;
		this.certificateDate = certificateDate;
	}
	
	public String getCourseName() {
		return courseName;
	}


	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}


	public Long getCertificateCount() {
		return certificateCount;
	}


	public void setCertificateCount(Long certificateCount) {
		this.certificateCount = certificateCount;
	}


	public Date getCertificateDate() {
		return certificateDate;
	}


	public void setCertificateDate(Date certificateDate) {
		this.certificateDate = certificateDate;
	}

	@Override
	public String toString() {
		return "ReportCourseCountStudentCertificateDTO [courseName=" + courseName + ", certificateCount="
				+ certificateCount + ", certificateDate=" + certificateDate + "]";
	}
}
