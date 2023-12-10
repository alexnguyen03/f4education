package com.f4education.springjwt.payload.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LearningResultResponse {
	private Integer classId;
	private String className;
	private String status;
	private Date startDate;
	private Date endDate;	
	private String teacherImage;
	private String teacherName;
	private Integer maximumQuantity;
	private Integer courseDuration;
	private String courseName;
}
