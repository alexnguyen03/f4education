package com.f4education.springjwt.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskDTO {
	private Integer taskId;

	private String title;
	
	private String description;
	
	private Date startDate;

	private Date endDate;
	
	private String className;
	
	private String teacherName;
}
