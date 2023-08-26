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
import jakarta.persistence.ManyToOne;
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
@Table(name = "Point")
public class Point {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "point_id")
	private Integer pointId;

	@Column(name = "average_point")
	private Float averagePoint;
	
	@OneToMany(mappedBy = "point1")
	List<DetailPoint> detailPoints;
	
	@ManyToOne
	@JoinColumn(name = "student_id")
	Student student; 
	
	@ManyToOne
	@JoinColumn(name = "register_course_id")
	RegisterCourse registerCourse;

	@Override
	public String toString() {
		return "Point [pointId=" + pointId + ", averagePoint=" + averagePoint + "]";
	} 
	
	
}
