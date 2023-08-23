package com.f4education.springjwt.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class EvaluateDTO {
	private Integer evaluateId;

	private Integer rating;

	private String content;
	
	private Date reviewDate;
}
