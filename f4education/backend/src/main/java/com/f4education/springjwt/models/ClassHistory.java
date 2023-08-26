package com.f4education.springjwt.models;

import java.io.Serializable;
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
@Table(name = "Classhistory")
public class ClassHistory implements Serializable{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "class_history_id")
	private Integer classHistoryId;

	private String action;

	@Column(name = "modify_date")
	private Date modifyDate;
	
	@Column(name = "class_name")
	private String className;

	@Column(name = "start_date")
	private Date startDate;

	@Column(name = "end_date")
	private Date endDate;
	
	@Column(name = "maximum_quantity")
	private Integer maximumQuantity;
	
	@Column(name = "admin_id")
	private String adminId;
	
	@ManyToOne
	@JoinColumn(name = "class_id")
	Classes classes;

	@Override
	public String toString() {
		return "ClassHistory [classHistoryId=" + classHistoryId + ", action=" + action + ", modifyDate=" + modifyDate
				+ ", className=" + className + ", startDate=" + startDate + ", endDate=" + endDate
				+ ", maximumQuantity=" + maximumQuantity + ", adminId=" + adminId + ", classes=" + classes + "]";
	} 	
	
	
}
