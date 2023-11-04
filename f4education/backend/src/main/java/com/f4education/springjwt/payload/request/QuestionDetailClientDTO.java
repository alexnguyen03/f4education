package com.f4education.springjwt.payload.request;

import java.util.Date;
import java.util.List;

import com.f4education.springjwt.models.Answer;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDetailClientDTO {
	private Integer questionDetailId;

	private String questionTitle;

	private Date createDate;

	private String levels;

	private Integer courseId;

	private String courseName;

	private Integer classId;

	private String className;

	private List<Answer> answer;

}