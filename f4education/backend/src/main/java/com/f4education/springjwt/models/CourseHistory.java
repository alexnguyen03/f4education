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
@Table(name = "Coursehistory")
public class CourseHistory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer courseHistoryId;

	@Column(name = "course_name")
	private String courseName;

	@Column(name = "course_price")
	private Float coursePrice;
	
	@Column(name = "course_duration")
	private String courseDuration;
	
	@Column(name = "course_description")
	private String courseDescription;
	
	@Column(name = "number_session")
	private Integer numberSession;
	
	private String image;
	
	@Column(name = "admin_id")
	private String adminId;
	
	@ManyToOne
	@JoinColumn(name = "courseId")
	Course course;

	@Override
	public String toString() {
		return "CourseHistory [courseHistoryId=" + courseHistoryId + ", courseName=" + courseName + ", coursePrice="
				+ coursePrice + ", courseDuration=" + courseDuration + ", courseDescription=" + courseDescription
				+ ", numberSession=" + numberSession + ", image=" + image + ", adminId=" + adminId + "]";
	} 	
	
	
}
