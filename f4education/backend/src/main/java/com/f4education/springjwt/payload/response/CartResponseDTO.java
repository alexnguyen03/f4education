package com.f4education.springjwt.payload.response;

import java.util.Date;

import com.f4education.springjwt.models.Course;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartResponseDTO {
	private Integer cartId;
	private Boolean status;
	private Course course;
	private String studentId;
	private Date createDate;
}