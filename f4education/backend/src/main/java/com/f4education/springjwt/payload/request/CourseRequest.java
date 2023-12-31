package com.f4education.springjwt.payload.request;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseRequest {
	@JsonProperty("subjectId")
	private Integer subjectId;

	@JsonProperty("adminId")
	private String adminId;

	@JsonProperty("courseId")
	private Integer courseId;

	@JsonProperty("courseName")
	private String courseName;

	@JsonProperty("coursePrice")
	private Float coursePrice;

	@JsonProperty("courseDuration")
	private Integer courseDuration;

	@JsonProperty("courseDescription")
	private String courseDescription;

	@JsonProperty("numberSession")
	private Integer numberSession;

	@JsonProperty("hourPerSession")
	private Integer hourPerSession;

	@JsonProperty("image")
	private String image;

	@JsonProperty("status")
	private Boolean status;

	@Override
	public String toString() {
		return "CourseRequest{" +

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
