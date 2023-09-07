package com.f4education.springjwt.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import java.util.Date;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "coursehistory")
@Builder
public class CourseHistory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer courseHistoryId;
	@Column(name = "course_name")
	private String courseName;
	@Column(name = "course_price")
	private Float coursePrice;
	@Column(name = "course_duration")
	private String courseDuration;
	@Column(name = "course_description")
	private String courseDescription;
	@Column(name = "number_session")
	private Integer numberSession;
	private String image;
	private String action;
	@Column(name = "modify_date")
	private Date modifyDate;
	@ManyToOne
	@JoinColumn(name = "course_id")
	Course course;

}
