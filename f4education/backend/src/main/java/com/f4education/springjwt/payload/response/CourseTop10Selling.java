package com.f4education.springjwt.payload.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CourseTop10Selling {
	private Integer course_id;

	private String course_name;

	private Double course_price;

	private Integer course_duration;

	private String course_description;

	private Integer number_session;

	private String image;

	private Integer subject_id;

	private String admin_id;

	private Boolean status;

	private Double total_sales;
}
