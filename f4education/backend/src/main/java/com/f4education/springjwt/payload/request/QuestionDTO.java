package com.f4education.springjwt.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {
	private Integer questionId;

	private String subjectName;

	private String courseName;
	
	private String courseImage;

	private Date createDate;

	private String adminName;

}