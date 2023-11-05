package com.f4education.springjwt.payload.response;

import java.util.Date;

import com.f4education.springjwt.models.RegisterCourse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EvaluateResponse {
	private Integer evaluateId;

	private Float rating;

	private String content;

	private String studentName;

	private String studentImage;

	private Date reviewDate;

	private RegisterCourse registerCourse;
}