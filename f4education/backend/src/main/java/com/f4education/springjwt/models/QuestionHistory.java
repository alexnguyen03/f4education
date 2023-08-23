package com.f4education.springjwt.models;

import java.util.Date;
import java.util.HashSet;
import java.util.Set;

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

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "QuestionHistory")
public class QuestionHistory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer questionHistoryId;

	private String operation;

	private Date operationDate;
	
	private String questionContent;

	private String answer;
	
	private String level;
	
	@ManyToOne
	@JoinColumn(name = "adminId")
	Admin admin; 
	
	@ManyToOne
	@JoinColumn(name = "questionId")
	Question question; 	
}
