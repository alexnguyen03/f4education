package com.f4education.springjwt.payload.request;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SubjectHistoryDTO {
	private Integer subjectHistoryId;

	private String action;

	private String modifyDate;

	private String adminId;
	
	private String subjectName;

	private Integer subjectId;
}
