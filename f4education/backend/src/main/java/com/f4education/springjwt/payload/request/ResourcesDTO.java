package com.f4education.springjwt.payload.request;

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
	
	private String folderName;

	private String link;
	
	private String adminName;
	
	private Course course;
}
