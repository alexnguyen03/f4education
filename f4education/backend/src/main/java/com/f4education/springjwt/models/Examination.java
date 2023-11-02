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
@Table(name = "Examination")
public class Examination implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "exam_id")
	private Integer examId;

	@Column(name = "finish_date")
	private Date finishDate;

	@ManyToOne
	@JsonIgnore
	@JoinColumn(name = "class_id")
	Classes classes;

	@ManyToOne
	@JsonIgnore
	@JoinColumn(name = "question_id")
	Question question;

	@Override
	public String toString() {
		return "Examination [examId=" + examId + ", finishDate=" + finishDate + "]";
	}
}
