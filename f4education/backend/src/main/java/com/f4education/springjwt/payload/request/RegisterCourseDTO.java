package com.f4education.springjwt.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterCourseDTO {
	private Integer registerCourseId;

	private Float coursePrice;

	private String courseDuration;
	
	private Date registrationDate;
	
	private Date startDate;
	
	private Date endDate;
	
	private Integer numberSession;
	
	private String status;
	
	private String image;
}
