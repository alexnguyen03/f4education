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
@Table(name = "Class")
public class Class {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer classId;

	private String className;

	private Date startDate;

	private Date endDate;
	
	private Integer maximumQuantity;
	
	@OneToMany(mappedBy = "class1")
	List<Attendance> attendances;
	
	@OneToMany(mappedBy = "class1")
	List<ClassHistory> classHistories;
	
	@OneToMany(mappedBy = "class1")
	List<Comment> comments;
	
	@OneToMany(mappedBy = "class1")
	List<Schedule> schedules;
	
	@OneToMany(mappedBy = "class1")
	List<Task> tasks;
}
