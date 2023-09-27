package com.f4education.springjwt.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillRequestDTO {
	private Float totalPrice;

	private String checkoutMethod;

	private String status;
	
	private Date createDate;
}
