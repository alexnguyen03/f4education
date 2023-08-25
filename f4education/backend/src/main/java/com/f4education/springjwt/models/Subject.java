package com.f4education.springjwt.models;

import java.io.Serializable;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
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
@Table(name = "Subject")
public class Subject implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "subjectid")
	private Integer subjectId;

	@Column(name = "subjectname")
	private String subjectName;

	@ManyToOne
	@JoinColumn(name = "admin_id")
	Admin admin;

	@OneToMany(mappedBy = "subject")
	List<SubjectHistory> subjectHistories;

	@OneToMany(mappedBy = "subject")
	List<Course> courses;
}
