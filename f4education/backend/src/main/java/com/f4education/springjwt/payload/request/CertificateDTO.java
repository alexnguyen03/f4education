package com.f4education.springjwt.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CertificateDTO {
	private Integer certificateId;

	private String certificateName;

	private Date startDate;

	private Date endDate;

	private Integer registerCourseId;
}
