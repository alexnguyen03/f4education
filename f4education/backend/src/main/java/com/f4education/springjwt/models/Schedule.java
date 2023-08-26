package com.f4education.springjwt.models;

import java.util.Date;
import java.util.HashSet;
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
@Table(name = "Schedule")
public class Schedule {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "schedule_id")
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
	Classes classes; 
	
	@ManyToOne
	@JoinColumn(name = "classroom_id")
	ClassRoom classRoom; 
	
	@ManyToOne
	@JoinColumn(name = "student_id")
	Student student;

	@Override
	public String toString() {
		return "Schedule [scheduleId=" + scheduleId + ", studyDate=" + studyDate + ", contents=" + contents + ", note="
				+ note + "]";
	} 
}
