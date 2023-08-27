package com.f4education.springjwt.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "coursehistory")
@Builder
public class CourseHistory {
	@ManyToOne
	@JoinColumn(name = "adminId")
	Admin admin;
	@ManyToOne
	@JoinColumn(name = "courseId")
	Course course;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer courseHistoryId;
	private String courseName;
	private Float coursePrice;
	private String courseDuration;
	private String courseDescription;
	private Integer numberSession;
	private String image;
	private String action;
	private Date modifyDate;

	public CourseHistory(String courseName, Float coursePrice, String courseDuration, String courseDescription, Integer numberSession, String image, String action, Date modifyDate) {
		this.courseName = courseName;
		this.coursePrice = coursePrice;
		this.courseDuration = courseDuration;
		this.courseDescription = courseDescription;
		this.numberSession = numberSession;
		this.image = image;
		this.action = action;
		this.modifyDate = modifyDate;
	}
}
