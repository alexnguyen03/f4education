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
@Table(name = "Evaluate")
public class Evaluate {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "evaluate_id")
	private Integer evaluateId;

	private Float rating;

	private String contents;
	
	@Column(name = "review_date")
	private Date reviewDate;
	
	@ManyToOne
	@JoinColumn(name = "student_id")
	@JsonIgnore
	Student student; 
	
	@ManyToOne
	@JoinColumn(name = "register_course_id")
	@JsonIgnore
	RegisterCourse registerCourse;

	@Override
	public String toString() {
		return "Evaluate [evaluateId=" + evaluateId + ", rating=" + rating + ", contents=" + contents + ", reviewDate="
				+ reviewDate + "]";
	} 
}
