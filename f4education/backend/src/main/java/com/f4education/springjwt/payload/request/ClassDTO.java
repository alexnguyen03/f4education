package com.f4education.springjwt.payload.request;

import java.util.Date;

import com.f4education.springjwt.models.Admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClassDTO {
	private Integer classId;

	private String className;

	private Date startDate;

	private Date endDate;
	
	private Integer maximumQuantity;
	
	private AdminDTO admin;
}
