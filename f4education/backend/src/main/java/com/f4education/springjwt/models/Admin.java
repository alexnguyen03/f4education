package com.f4education.springjwt.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Admin")
public class Admin implements Serializable {
	@OneToMany(mappedBy = "admin")
	@JsonIgnore
	private List<Bill> bill;
	@OneToMany(mappedBy = "admin")
	@JsonIgnore
	private List<Schedule> schedules;
	@JsonIgnore
	@OneToMany(mappedBy = "admin")
	private List<Subject> subject;
	@JsonIgnore
	@OneToMany(mappedBy = "admin")
	private List<Course> course;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "admin_id")
	private String adminId;
	private String fullname;
	@Column(name = "gender")
	private Boolean gender;
	@Column(name = "date_of_birth")
	private Date dateOfBirth;
	@Column(name = "citizen_identification")
	private String citizenIdentification;
	private String levels;
	private String address;
	@Column(name = "phone")
	private String phone;
	@Column(name = "image")
	private String image;
	@JsonIgnore
	@OneToMany(mappedBy = "admin")
	private List<Classes> classes;
	@JsonIgnore
	@OneToMany(mappedBy = "admin")
	private List<ClassRoom> classRooms;
	@JsonIgnore
	@OneToMany(mappedBy = "admin")
	private List<Course> courses;
	@JsonIgnore
	@OneToMany(mappedBy = "admin")
	private List<Question> questions;
	@JsonIgnore
	@OneToMany(mappedBy = "admin")
	private List<Resources> resources;

	@ManyToOne
	@JsonIgnore
	@JoinColumn(name = "account_id")
	User user;

	@Override
	public String toString() {
		return "Admin [adminId=" + adminId + ", fullname=" + fullname + ", gender=" + gender + ", dateOfBirth="
				+ dateOfBirth + ", citizenIdentification=" + citizenIdentification + ", levels=" + levels + ", address="
				+ address + ", phone=" + phone + ", image=" + image + "]";
	}
}
