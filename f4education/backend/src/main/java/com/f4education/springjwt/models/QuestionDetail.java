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
@Table(name = "Questiondetail")
public class QuestionDetail implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "question_detail_id")
	private Integer questionDetailId;
	
	@Column(name = "question_title")
	private String questionTitle;
	
	@Column(name = "create_date")
	private Date createDate;
	
	private String levels;

	@OneToMany(mappedBy = "questionDetail")
	List<Answer> answers;

	@ManyToOne
	@JsonIgnore
	@JoinColumn(name = "question_id")
	Question question;

	@Override
	public String toString() {
		return "QuestionDetail [questionDetailId=" + questionDetailId + ", questionTitle=" + questionTitle
				+ ", createDate=" + createDate + ", levels=" + levels + "]";
	}
}
