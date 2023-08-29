package com.f4education.springjwt.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseRequest {
	private Integer courseId;

	private String courseName;

	private Float coursePrice;

	private String courseDuration;

	private String courseDescription;

	private Integer numberSession;

	private String image;

	private Integer subjectId;

	private String adminId;

	@Override
	public String toString() {
		return "CourseRequest{" +
				"courseId=" + courseId +
				", courseName='" + courseName + '\'' +
				", coursePrice=" + coursePrice +
				", courseDuration='" + courseDuration + '\'' +
				", courseDescription='" + courseDescription + '\'' +
				", numberSession=" + numberSession +
				", image='" + image + '\'' +
				", subjectId=" + subjectId +
				", adminId='" + adminId + '\'' +
				'}';
	}
}
