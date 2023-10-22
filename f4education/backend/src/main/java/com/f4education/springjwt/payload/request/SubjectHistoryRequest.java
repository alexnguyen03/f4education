package com.f4education.springjwt.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubjectHistoryRequest {
	private Integer subjectHistoryId;

	private String action;

	private Date modifyDate;

	private String adminId;
	
	private String subjectName;

	private Integer subjectId;
}
