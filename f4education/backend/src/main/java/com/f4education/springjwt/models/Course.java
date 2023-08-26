package com.f4education.springjwt.models;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Course")
public class Course {
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
}