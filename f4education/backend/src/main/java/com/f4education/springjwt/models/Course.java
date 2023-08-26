package com.f4education.springjwt.models;

import java.io.Serializable;
import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

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

}
