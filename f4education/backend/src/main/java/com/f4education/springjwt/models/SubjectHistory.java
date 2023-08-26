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
@Table(name = "SubjectHistory")
public class SubjectHistory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer subjectHistoryId;
	
	@Column(name = "subject_name")
	private String subjectName;

	private String action;

	@Column(name = "modify_date")
	private Date modifyDate;
	
	@ManyToOne
	@JoinColumn(name = "admin_id")
	Admin admin; 
	
	@ManyToOne
	@JoinColumn(name = "subject_id")
	Subject subject;

	@Override
	public String toString() {
		return "SubjectHistory [subjectHistoryId=" + subjectHistoryId + ", subjectName=" + subjectName + ", action="
				+ action + ", modifyDate=" + modifyDate + "]";
	} 	
}
