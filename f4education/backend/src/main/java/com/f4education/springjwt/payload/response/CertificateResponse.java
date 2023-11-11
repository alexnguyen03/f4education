package com.f4education.springjwt.payload.response;

import java.util.Date;

import com.f4education.springjwt.models.RegisterCourse;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CertificateResponse {
	private Integer certificateId;

	private String certificateName;

	private Date startDate;

	private Date endDate;
	
	private Date createDate;

	private RegisterCourse registerCourse;
}
