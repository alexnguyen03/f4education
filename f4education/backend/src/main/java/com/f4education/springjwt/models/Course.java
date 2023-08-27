package com.f4education.springjwt.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Course")
public class Course implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer courseId;

	private String courseName;

	private Float coursePrice;

	private String courseDuration;

	private String courseDescription;

	private Integer numberSession;

	private String image;

	@OneToMany(mappedBy = "course")
	List<CourseHistory> courseHistories;

	@OneToMany(mappedBy = "course")
	List<Question> questions;

	@OneToMany(mappedBy = "course")
	List<RegisterCourse> registerCourses;

	@OneToMany(mappedBy = "course")
	List<Resources> resources;

	@ManyToOne
	@JoinColumn(name = "subjectId")
	Subject subject;

	@ManyToOne
	@JoinColumn(name = "admin_id")
	Admin admin;

	public Course(String courseName, Float coursePrice, String courseDuration, String courseDescription, Integer numberSession, String image) {
		this.courseName = courseName;
		this.coursePrice = coursePrice;
		this.courseDuration = courseDuration;
		this.courseDescription = courseDescription;
		this.numberSession = numberSession;
		this.image = image;
	}
}
