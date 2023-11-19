package com.f4education.springjwt.models;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Quizzresult")
public class QuizResult implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "quizz_id")
	private Integer quizzId;

	private Integer score;

	private Integer duration;

	@Column(name = "quizz_date")
	private Date quizzDate;

	@ManyToOne
	@JsonIgnore
	@JoinColumn(name = "course_id")
	Course course;

	@ManyToOne
	@JsonIgnore
	@JoinColumn(name = "class_id")
	Classes classes;

	@ManyToOne
	@JoinColumn(name = "student_id")
	Student student;

	@Override
	public String toString() {
		return "QuizResult [quizzId=" + quizzId + ", score=" + score + ", duration=" + duration + ", quizzDate="
				+ quizzDate + "]";
	}
}
