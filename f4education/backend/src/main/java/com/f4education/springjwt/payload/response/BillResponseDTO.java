package com.f4education.springjwt.payload.response;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class BillResponseDTO {
	private Integer billId;
	private Date createDate;
	private Float totalPrice;
	private Boolean status;
	private String notes;
	private String paymentMethod;
}
