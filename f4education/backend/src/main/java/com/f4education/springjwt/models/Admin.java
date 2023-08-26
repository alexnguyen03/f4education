package com.f4education.springjwt.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Admin")
public class Admin {
	@OneToMany(mappedBy = "admin")
	@JsonIgnore
	List<Bill> bill;
	@OneToMany(mappedBy = "admin")
	@JsonIgnore
	List<Schedule> schedules;
	@JsonIgnore
	@OneToMany(mappedBy = "admin")
	List<Subject> subject;
	@JsonIgnore
	@OneToMany(mappedBy = "admin")
	List<Course> course;
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "admin_id")
	private String adminId;
	@Column(name = "fullname")
	private String fullname;
	@Column(name = "gender")
	private Boolean gender;
	@Column(name = "date_of_birth")
	private Date dateOfBirth;
	@Column(name = "citizen_identification")
	private String citizenIdentification;
	@Column(name = "address")
	private String address;
	@Column(name = "phone")
	private String phone;
	@Column(name = "image")
	private String image;

	@Override
	public String toString() {
		return "Admin{" +
				"adminId='" + adminId + '\'' +
				", fullname='" + fullname + '\'' +
				", gender=" + gender +
				", dateOfBirth=" + dateOfBirth +
				", citizenIdentification='" + citizenIdentification + '\'' +
				", address='" + address + '\'' +
				", phone='" + phone + '\'' +
				", image='" + image + '\'' +
				'}';
	}
}
