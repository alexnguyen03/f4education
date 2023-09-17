package com.f4education.springjwt.payload.request;

import java.util.Date;

import com.f4education.springjwt.models.Course;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ResourcesDTO {
	private Integer resourcesId;

	private String resourcesName;

	private String link;
	
	private Date createDate;
	
	private String adminName;
	
	private Course course;
}
