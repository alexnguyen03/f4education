package com.f4education.springjwt.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetailInvoiceDTO {
	private Integer detailInvoiceId;

	private Float price;

	private Float totalMoney;
	
	private String note;
}
