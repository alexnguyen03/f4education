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
@Table(name = "Question")
public class Question implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "question_id")
	private Integer questionId;

	@Column(name = "create_date")
	private Date createDate;
	
	private Boolean status;

	@OneToMany(mappedBy = "question")
	List<QuestionDetail> questionDetails;

	@ManyToOne
	@JsonIgnore
	@JoinColumn(name = "course_id")
	Course course;

	@ManyToOne
	@JsonIgnore
	@JoinColumn(name = "subject_id")
	Subject subject;
	
	@ManyToOne
	@JoinColumn(name = "admin_id")
	Admin admin;

	@Override
	public String toString() {
		return "Question [questionId=" + questionId + ", createDate=" + createDate + ", status=" + status + "]";
	}
}
