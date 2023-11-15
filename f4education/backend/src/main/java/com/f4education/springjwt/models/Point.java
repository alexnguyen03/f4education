package com.f4education.springjwt.models;

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
@Table(name = "Point")
public class Point {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "point_id")
	private Integer pointId;

	@Column(name = "average_point")
	private Float averagePoint;

	@Column(name = "attendance_point")
	private Float attendancePoint;

	@Column(name = "exercise_point")
	private Float exercisePoint;

	@Column(name = "quizz_point")
	private Float quizzPoint;

	@ManyToOne
	@JoinColumn(name = "student_id")
	Student student;

	@ManyToOne
	@JoinColumn(name = "class_id")
	Classes classes;

	@Override
	public String toString() {
		return "Point [pointId=" + pointId + ", averagePoint=" + averagePoint + "]";
	}

}
