package com.f4education.springjwt.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClassHistoryDTO {
	private Integer classHistoryId;

	private String operation;

	private Date operationDate;
	
	private String className;
	
	private Date startDate;

	private Date endDate;
	
	private Integer maximumQuantity;
}
