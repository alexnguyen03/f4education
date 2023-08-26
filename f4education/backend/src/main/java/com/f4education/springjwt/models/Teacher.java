package com.f4education.springjwt.models;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
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
@Table(name = "Teacher")
public class Teacher {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private String teacherId;

	private String fullname;

	private Boolean gender;

	private Date dateOfBirth;
	
	private String citizenIdentification;
	
	private String address;
	
	private String phone;
	
	private String image;

	@Override
	public String toString() {
		return "Teacher{" +
				"teacherId='" + teacherId + '\'' +
				", fullname='" + fullname + '\'' +
				", gender=" + gender +
				", dateOfBirth=" + dateOfBirth +
				", citizenIdentification='" + citizenIdentification + '\'' +
				'}';
	}
}
