package com.f4education.springjwt.models;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
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
@Table(name = "Schedule")
public class Schedule {
	@Id
	@Column(name = "schedule_id")

	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer scheduleId;

	@Column(name = "study_date")
	private Date studyDate;

	private String contents;
	
	private String note;
	
	@ManyToOne
	@JoinColumn(name = "admin_id")
	Admin admin; 
	
	@ManyToOne
	@JoinColumn(name = "academic_id")
	Academic academic; 
	
	@ManyToOne
	@JoinColumn(name = "class_id")
	Class class1; 
	
	@ManyToOne
	@JoinColumn(name = "classroom_id")
	ClassRoom classRoom; 
	
	@ManyToOne
	@JoinColumn(name = "student_id")
	Student student; 
}
