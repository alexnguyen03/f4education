package com.f4education.springjwt.payload.request;

import java.util.Date;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubjectDTO {
	private Integer subjectId;

	private String subjectName;
	
	private String adminName;
	
	private Date createDate;
	
	private List<Object[]> totalCoursePerSubject;
}
