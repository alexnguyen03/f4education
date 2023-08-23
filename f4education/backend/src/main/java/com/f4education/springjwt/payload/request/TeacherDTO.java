package com.f4education.springjwt.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TeacherDTO {
	private String teacherId;

	private String fullname;

	private Boolean gender;

	private Date dateOfBirth;
	
	private String citizenIdentification;
	
	private String address;
	
	private String phone;
	
	private String image;
}
