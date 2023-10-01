package com.f4education.springjwt.models;

import jakarta.persistence.Column;
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
	@Column(name = "course_id")
	private Integer courseId;

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

	@OneToMany(mappedBy = "course")
	List<CourseHistory> courseHistories;

	@OneToMany(mappedBy = "course")
	List<QuestionDetail> questions;

	@OneToMany(mappedBy = "course")
	List<RegisterCourse> registerCourses;

	@OneToMany(mappedBy = "course")
	List<Resources> resources;

	@ManyToOne
	@JoinColumn(name = "subject_id")
	Subject subject;

	@Override
	public String toString() {
		return "Course [courseId=" + courseId + ", courseName=" + courseName + ", coursePrice=" + coursePrice
				+ ", courseDuration=" + courseDuration + ", courseDescription=" + courseDescription + ", numberSession="
				+ numberSession + ", image=" + image + "]";
	}

	@ManyToOne
	@JoinColumn(name = "admin_id")
	Admin admin;

	public Course(String courseName, Float coursePrice, String courseDuration, String courseDescription,
			Integer numberSession, String image) {
		this.courseName = courseName;
		this.coursePrice = coursePrice;
		this.courseDuration = courseDuration;
		this.courseDescription = courseDescription;
		this.numberSession = numberSession;
		this.image = image;
	}
}
