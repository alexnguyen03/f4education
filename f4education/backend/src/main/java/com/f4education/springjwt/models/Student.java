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
@Table(name = "Student")
public class Student {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer studentId;

	private String fullname;

	private Boolean gender;

	private String address;
	
	private String phone;
	
	private String image;
	
	@OneToMany(mappedBy = "student")
	List<Attendance> attendances;
	
	@OneToMany(mappedBy = "student")
	List<Bill> bills;
	
	@OneToMany(mappedBy = "student")
	List<Evaluate> evaluates;
	
	@OneToMany(mappedBy = "student")
	List<Point> points;
	
	@OneToMany(mappedBy = "student")
	List<RegisterCourse> registerCourses;
	
	@OneToMany(mappedBy = "student")
	List<Schedule> schedules;
}
