package com.f4education.springjwt.payload.response;

import com.f4education.springjwt.models.Subject;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CourseResponse {
	private Integer courseId;

	private String courseName;

	private Float coursePrice;

	private Integer courseDuration;

	private String courseDescription;

	private Integer numberSession;

	private Subject subject;

	private String image;
	
	private Integer registerCourseId;
	
	private Boolean isPurchase;

	private Float rating;

	private Integer reviewNumber;
	
	private Integer totalStudent;
}
