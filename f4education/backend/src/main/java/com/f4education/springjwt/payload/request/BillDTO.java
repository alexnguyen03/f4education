package com.f4education.springjwt.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillDTO {
	private Integer billId;

	private Date createDate;

	private Date endDate;
	
	private Float totalPrice;
	
	private String status;
}
