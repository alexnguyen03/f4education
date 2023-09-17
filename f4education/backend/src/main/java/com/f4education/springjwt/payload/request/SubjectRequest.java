package com.f4education.springjwt.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubjectRequest {
	private Integer subjectId;

	private String subjectName;
	
	private String adminId;
	
}
