package com.f4education.springjwt.payload.request;

import com.f4education.springjwt.models.Subject;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseDTO {
	private Integer courseId;

	private String courseName;

	private Float coursePrice;

	private Integer courseDuration;

	private String courseDescription;

	private Subject subject;

	private String image;

	private Boolean status;

	private Float rating;

	private Integer reviewNumber;

	private Integer totalStudent;

	@Override
	public String toString() {
		return "CourseDTO [courseId=" + courseId + ", courseName=" + courseName + ", coursePrice=" + coursePrice
				+ ", courseDuration=" + courseDuration + ", courseDescription=" + courseDescription + ", subject="
				+ subject + ", image=" + image + ", status=" + status + "]";
	}

}
