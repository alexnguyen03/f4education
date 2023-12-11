package com.f4education.springjwt.payload.response;

import java.util.Date;

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

	private Subject subject;

	private String image;
	
	private Integer registerCourseId;
	
	private Boolean isPurchase;

	private Float rating;

	private Integer reviewNumber;
	
	private Integer totalStudent;
	
	private Double totalRenueve;
	
	private Date createDate;

	@Override
	public String toString() {
		return "CourseResponse [courseId=" + courseId + ", courseName=" + courseName + ", coursePrice=" + coursePrice
				+ ", courseDuration=" + courseDuration + ", courseDescription=" + courseDescription + ", subject="
				+ subject + ", image=" + image + ", registerCourseId=" + registerCourseId + ", isPurchase=" + isPurchase
				+ ", rating=" + rating + ", reviewNumber=" + reviewNumber + ", totalStudent=" + totalStudent
				+ ", totalRenueve=" + totalRenueve + ", createDate=" + createDate + "]";
	}
}
