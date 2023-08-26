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
@Table(name = "Evaluate")
public class Evaluate {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "evaluate_id")
	private Integer evaluateId;

	private Integer rating;

	private String contents;
	
	@Column(name = "review_date")
	private Date reviewDate;
	
	@ManyToOne
	@JoinColumn(name = "student_id")
	Student student; 
	
	@ManyToOne
	@JoinColumn(name = "register_course_id")
	RegisterCourse registerCourse;

	@Override
	public String toString() {
		return "Evaluate [evaluateId=" + evaluateId + ", rating=" + rating + ", contents=" + contents + ", reviewDate="
				+ reviewDate + "]";
	} 
}
