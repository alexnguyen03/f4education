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
@Table(name = "Certificate")
public class Certificate {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "certificate_id")
	private Integer certificateId;

	@Column(name = "certificate_name")
	private String certificateName;

	@Column(name = "date_range")
	private Date dateRange;
	
	@ManyToOne
	@JoinColumn(name = "register_course_id")
	RegisterCourse registerCourse;

	@Override
	public String toString() {
		return "Certificate [certificateId=" + certificateId + ", certificateName=" + certificateName + ", dateRange="
				+ dateRange + "]";
	} 
}
