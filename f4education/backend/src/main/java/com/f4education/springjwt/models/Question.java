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
@Table(name = "Question")
public class Question {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "question_id")
	private Integer questionId;

	@Column(name = "question_content")
	private String questionContent;

	private String answer;
	
	private String levels;
	
	@OneToMany(mappedBy = "question")
	List<QuestionHistory> questionHistory;
	
	@ManyToOne
	@JoinColumn(name = "course_id")
	Course course; 
	
	@ManyToOne
	@JoinColumn(name = "admin_id")
	Admin admin;

	@Override
	public String toString() {
		return "Question [questionId=" + questionId + ", questionContent=" + questionContent + ", answer=" + answer
				+ ", levels=" + levels + "]";
	} 
}
