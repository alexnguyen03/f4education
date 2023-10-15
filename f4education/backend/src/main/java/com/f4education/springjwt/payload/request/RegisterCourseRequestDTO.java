package com.f4education.springjwt.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterCourseRequestDTO {
	private Integer registerCourseId;

	private Integer courseId;

	private String studentId;
}
