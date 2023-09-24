package com.f4education.springjwt.payload.request;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartRequestDTO {
	private Integer courseId;
	private Integer studentId;
}
