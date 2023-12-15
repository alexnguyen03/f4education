package com.f4education.springjwt.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.List;
import java.util.Objects;

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
	private Integer courseDuration;

	@Column(name = "course_description")
	private String courseDescription;


	private String image;

	private Boolean status;

	@JsonIgnore
	@OneToMany(mappedBy = "course")
	List<CourseHistory> courseHistories;

	@JsonIgnore
	@OneToMany(mappedBy = "course")
	List<Question> questions;

	@JsonIgnore
	@OneToMany(mappedBy = "course")
	List<RegisterCourse> registerCourses;

	@JsonIgnore
	@OneToMany(mappedBy = "course")
	List<Resources> resources;

	@JsonIgnore
	@OneToMany(mappedBy = "course")
	List<QuizResult> quizResults;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "subject_id")
	Subject subject;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "admin_id")
	Admin admin;

	@JsonIgnore
	@OneToMany(mappedBy = "course")
	List<Bill> bill;

	@JsonIgnore
	@OneToMany(mappedBy = "course")
	List<CourseDetail> courseDetail;

	public Course(String courseName, Float coursePrice, Integer courseDuration, String courseDescription,
				  String image) {
		this.courseName = courseName;
		this.coursePrice = coursePrice;
		this.courseDuration = courseDuration;
		this.courseDescription = courseDescription;
		// this.numberSession = numberSession;
		this.image = image;
	}

	@Override
	public boolean equals(Object o) {
		if (this == o) return true;
		if (o == null || getClass() != o.getClass()) return false;
		Course course = (Course) o;
		return Objects.equals(courseId, course.courseId) && Objects.equals(courseName, course.courseName) && Objects.equals(coursePrice, course.coursePrice) && Objects.equals(courseDuration, course.courseDuration) && Objects.equals(courseDescription, course.courseDescription) && Objects.equals(image, course.image) && Objects.equals(status, course.status) && Objects.equals(courseHistories, course.courseHistories) && Objects.equals(questions, course.questions) && Objects.equals(registerCourses, course.registerCourses) && Objects.equals(resources, course.resources) && Objects.equals(quizResults, course.quizResults) && Objects.equals(subject, course.subject) && Objects.equals(admin, course.admin) && Objects.equals(bill, course.bill) && Objects.equals(courseDetail, course.courseDetail);
	}

	@Override
	public int hashCode() {
		return Objects.hash(courseId, courseName, coursePrice, courseDuration, courseDescription, image, status, courseHistories, questions, registerCourses, resources, quizResults, subject, admin, bill, courseDetail);
	}

	public Integer getCourseId() {
		return courseId;
	}

	public void setCourseId(Integer courseId) {
		this.courseId = courseId;
	}

	@Override
	public String toString() {
		return "Course [courseId=" + courseId + ", courseName=" + courseName + ", coursePrice=" + coursePrice
				+ ", courseDuration=" + courseDuration + ", courseDescription=" + courseDescription + ", image=" + image
				+ ", subject=" + subject + "]";
	}

}
