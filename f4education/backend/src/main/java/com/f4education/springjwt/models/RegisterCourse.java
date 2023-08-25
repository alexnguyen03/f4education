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
@Table(name = "RegisterCourse")
public class RegisterCourse {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer registerCourseId;

	private Float coursePrice;

	private String courseDuration;
	
	private Date registrationDate;
	
	private Date startDate;
	
	private Date endDate;
	
	private Integer numberSession;
	
	private String status;
	
	private String image;
	
	@OneToMany(mappedBy = "registerCourse")
	List<Certificate> certificate;
	
	@OneToMany(mappedBy = "registerCourse")
	List<Evaluate> evaluates;
	
	@OneToMany(mappedBy = "registerCourse")
	List<Point> points;
	
	@ManyToOne
	@JoinColumn(name = "studentId")
	Student student; 
	
	@ManyToOne
	@JoinColumn(name = "courseId")
	Course course; 
	
	@ManyToOne
	@JoinColumn(name = "class_id")
	Classes classes; 
}
