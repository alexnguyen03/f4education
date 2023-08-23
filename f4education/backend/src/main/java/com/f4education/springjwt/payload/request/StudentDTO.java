package com.f4education.springjwt.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StudentDTO {
	private Integer studentId;

	private String fullname;

	private Boolean gender;

	private String address;
	
	private String phone;
	
	private String image;
}
