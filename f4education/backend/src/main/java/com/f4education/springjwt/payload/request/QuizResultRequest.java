package com.f4education.springjwt.payload.request;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QuizResultRequest {
	@JsonProperty("quizzId")
	private Integer quizzId;

	@JsonProperty("score")
	private Float score;
	
	@JsonProperty("duration")
	private Integer duration;
	
	@JsonProperty("quizzDate")
	private Date quizzDate;

	@JsonProperty("courseId")
	private Integer courseId;
	
	@JsonProperty("classId")
	private Integer classId;
	
	@JsonProperty("studentId")
	private String studentId;

	@Override
	public String toString() {
		return "QuizResultRequest [quizzId=" + quizzId + ", score=" + score + ", duration=" + duration + ", quizzDate="
				+ quizzDate + ", courseId=" + courseId + ", classId=" + classId + ", studentId=" + studentId + "]";
	}
}
