package com.f4education.springjwt.models;

import java.util.Date;
import java.util.HashSet;
import java.util.List;
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
import jakarta.persistence.OneToMany;
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
@Table(name = "Admin")
public class Admin {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "admin_id")
	private String adminId;

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

	@OneToMany(mappedBy = "admin")
	List<Bill> bill;

	@OneToMany(mappedBy = "admin")
	List<Classes> classes;

	@OneToMany(mappedBy = "admin")
	List<Course> courses;

	@OneToMany(mappedBy = "admin")
	List<Question> questions;

	@OneToMany(mappedBy = "admin")
	List<Resources> resources;

	@OneToMany(mappedBy = "admin")
	List<Schedule> schedules;

	@OneToMany(mappedBy = "admin")
	List<Subject> subject;

	@Override
	public String toString() {
		return "Admin [adminId=" + adminId + ", fullname=" + fullname + ", gender=" + gender + ", dateOfBirth="
				+ dateOfBirth + ", citizenIdentification=" + citizenIdentification + ", levels=" + levels + ", address="
				+ address + ", phone=" + phone + ", image=" + image + "]";
	}
}
