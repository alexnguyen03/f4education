package com.f4education.springjwt.models;

import java.io.Serializable;

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
@Table(name = "Point")
public class Point implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "point_id")
	private Integer pointId;

	@Column(name = "average_point")
	private Double averagePoint;

	@Column(name = "exercise_point")
	private Double exercisePoint;

	@Column(name = "quizz_point")
	private Double quizzPoint;

	@Column(name = "attendance_point")
	private Double attendancePoint;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "student_id")
	Student student;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "class_id")
	Classes classes;

	@Override
	public String toString() {
		return "Point [pointId=" + pointId + ", averagePoint=" + averagePoint + "]";
	}

}
