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

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "ClassHistory")
public class ClassHistory {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer classHistoryId;

	private String operation;

	private Date operationDate;
	
	@Column(name = "class_name")
	private String className;

	@Column(name = "start_date")
	private Date startDate;

	@Column(name = "end_date")
	private Date endDate;
	
	@Column(name = "maximum_quantity")
	private Integer maximumQuantity;
	
	@ManyToOne
	@JoinColumn(name = "adminId")
	Admin admin; 
	
	@ManyToOne
	@JoinColumn(name = "class_id")
	Classes class1; 	
}
