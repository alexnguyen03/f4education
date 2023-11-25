package com.f4education.springjwt.payload.request;

public class ReportCourseCountStudentDTO {
	private String courseName;
    private Long studentCount;
    
    public ReportCourseCountStudentDTO(String courseName, Long studentCount) {
        this.courseName = courseName;
        this.studentCount = studentCount;
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

	@Override
	public String toString() {
		return "ReportCourseCountStudentDTO [courseName=" + courseName + ", studentCount=" + studentCount + "]";
	}
}
