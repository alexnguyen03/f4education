package com.f4education.springjwt.models;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
@Table(name = "Teacher")
@Getter
@Setter
public class Teacher implements Serializable {
	@Id
	// @GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "teacher_id")
	private String teacherId;

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

	@JsonIgnore
	@OneToMany(mappedBy = "teacher")
	List<Classes> classes;

	@JsonIgnore
	@ManyToOne
	@JoinColumn(name = "account_id")
	User user;

	@JsonIgnore
	@OneToMany(mappedBy = "teacher")
	List<TeacherHistory> teacherHistory;

	@Override
	public String toString() {
		return "Teacher [teacherId=" + teacherId + ", fullname=" + fullname + ", gender=" + gender + ", dateOfBirth="
				+ dateOfBirth + ", citizenIdentification=" + citizenIdentification + ", levels=" + levels + ", address="
				+ address + ", phone=" + phone + ", image=" + image + "]";
	}

}
