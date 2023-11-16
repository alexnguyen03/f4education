package com.f4education.springjwt.models;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Attendance")
public class Attendance {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "attendance_id")
	private Integer attendanceId;

	@Column(name = "attendance_date")
	private Date attendanceDate;

	@ManyToOne
	@JoinColumn(name = "class_id")
	@JsonIgnore
	Classes classes;

	@ManyToOne
	@JoinColumn(name = "student_id")
	@JsonIgnore
	Student student;

	@Override
	public String toString() {
		return "Attendance [attendanceId=" + attendanceId + ", attendanceDate=" + attendanceDate + "]";
	}

}
