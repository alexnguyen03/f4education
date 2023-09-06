package com.f4education.springjwt.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClassRoomHistoryDTO {
	private Integer classroomHistoryId;

	private String action;

	private Date modifyDate;
	
	private String classroomName;
	
	private String status;
	
	private AdminDTO admin;
	
	private Integer classroomId;
}
