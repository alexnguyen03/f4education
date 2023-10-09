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
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "TeacherHistory")
@Getter
@Setter
public class TeacherHistory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "teacher_history_id")
	private Integer teacherHistoryId;

	@Column(name = "modify_date")
	private Date modifyDate;

	private String action;

	@ManyToOne
	@JoinColumn(name = "teacher_id")
	Teacher teacher;

	private String fullname;

	private Boolean gender;

	@Column(name = "date_of_birth")
	private Date dateOfBirth;

	@Column(name = "citizen_identification")
	private String citizenIdentification;

	private String levels;

	private String address;

	private String phone;

	private String image;

	@ManyToOne
	@JoinColumn(name = "account_id")
	User user;
}
