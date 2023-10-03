package com.f4education.springjwt.models;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.Column;
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
import lombok.ToString;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Registercourse")
public class RegisterCourse {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "register_course_id")
	private Integer registerCourseId;

	@Column(name = "course_price")
	private Float coursePrice;

	@Column(name = "course_duration")
	private String courseDuration;
	
	@Column(name = "registration_date")
	private Date registrationDate;
	
	@Column(name = "start_date")
	private Date startDate;
	
	@Column(name = "end_date")
	private Date endDate;
	
	@Column(name = "number_session")
	private Integer numberSession;
	
	private String status;
	
	private String image;
	
	@OneToMany(mappedBy = "registerCourse")
	List<Certificate> certificate;
	
	@OneToMany(mappedBy = "registerCourse")
	List<Evaluate> evaluates;
	
	@OneToMany(mappedBy = "registerCourse")
	List<Point> points;
	
	@OneToMany(mappedBy = "registerCourse")
	List<Attendance> attendances;
	
	@ManyToOne
	@JoinColumn(name = "student_id")
	Student student; 
	
	@ManyToOne
	@JoinColumn(name = "course_id")
	Course course; 
	
	@ManyToOne
	@JoinColumn(name = "class_id")
	Classes classes;

	@Override
	public String toString() {
		return "RegisterCourse [registerCourseId=" + registerCourseId + ", coursePrice=" + coursePrice
				+ ", courseDuration=" + courseDuration + ", registrationDate=" + registrationDate + ", startDate="
				+ startDate + ", endDate=" + endDate + ", numberSession=" + numberSession + ", status=" + status
				+ ", image=" + image + "]";
	} 
}
