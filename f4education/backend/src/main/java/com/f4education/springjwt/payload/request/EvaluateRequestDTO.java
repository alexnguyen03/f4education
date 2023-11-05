package com.f4education.springjwt.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EvaluateRequestDTO {
	private Float rating;

	private String content;

	private String studentId;

	private Integer registerCourseId;
}
