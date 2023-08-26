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
@Table(name = "QuestionHistory")
public class QuestionHistory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "question_history_id")
	private Integer questionHistoryId;

	private String action;

	@Column(name = "modify_date")
	private Date modifyDate;
	
	@Column(name = "question_content")
	private String questionContent;

	private String answer;
	
	private String levels;
	
	@Column(name = "admin_id")
	private String adminId;
	
	@ManyToOne
	@JoinColumn(name = "question_id")
	Question question;

	@Override
	public String toString() {
		return "QuestionHistory [questionHistoryId=" + questionHistoryId + ", action=" + action + ", modifyDate="
				+ modifyDate + ", questionContent=" + questionContent + ", answer=" + answer + ", levels=" + levels
				+ ", adminId=" + adminId + "]";
	} 	
}
