package com.f4education.springjwt.models;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "CourseDetail")
public class CourseDetail implements Serializable {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "course_detail_id")
	private Integer courseDetailId;

	@Column(name = "lesson_title")
	private String lessionTitle;

	@Column(name = "lesson_content")
	private String lessionContent;

	@Column(name = "create_date")
	private Date createDate;

	@ManyToOne
	@JoinColumn(name = "course_id")
	@JsonIgnore
	Course course;

	@Override
	public String toString() {
		return "CourseDetail [courseDetailId=" + courseDetailId + ", lessionTitle=" + lessionTitle + ", lessionContent="
				+ lessionContent + "]";
	}

}
