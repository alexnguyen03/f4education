package com.f4education.springjwt.models;

import java.util.Date;

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
    QuestionDetail question;

	@Override
	public String toString() {
		return "QuestionHistory [questionHistoryId=" + questionHistoryId + ", action=" + action + ", modifyDate="
				+ modifyDate + ", questionContent=" + questionContent + ", answer=" + answer + ", levels=" + levels
				+ ", adminId=" + adminId + "]";
	} 	
}
