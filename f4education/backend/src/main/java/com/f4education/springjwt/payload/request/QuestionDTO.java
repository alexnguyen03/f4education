package com.f4education.springjwt.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {
	private Integer questionId;

	private String questionContent;

	private String answer;
	
	private String levels;
	
	private String courseName;
	
	private String adminName;
}