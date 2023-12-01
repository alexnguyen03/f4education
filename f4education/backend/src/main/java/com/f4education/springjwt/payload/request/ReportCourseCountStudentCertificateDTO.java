package com.f4education.springjwt.payload.request;

public class ReportCourseCountStudentCertificateDTO {
	private String courseName;
    private Long certificateCount;
    
    public ReportCourseCountStudentCertificateDTO(String courseName, Long certificateCount) {
        this.courseName = courseName;
        this.certificateCount = certificateCount;
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

	@Override
	public String toString() {
		return "ReportCourseCountStudentDTO [courseName=" + courseName + ", certificateCount=" + certificateCount + "]";
	}
}
