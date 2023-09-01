package com.f4education.springjwt.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubjectDTO {
	private Integer subjectId;

	private String subjectName;
	
	private String adminId;
	
	private Date createDate;
}
