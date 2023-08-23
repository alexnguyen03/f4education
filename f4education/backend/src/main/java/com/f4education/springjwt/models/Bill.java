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

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Bill")
public class Bill {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer billId;

	private Date createDate;

	private Date endDate;
	
	private Float totalPrice;
	
	private String status;
	
	private String note;
	
	@OneToMany(mappedBy = "bill")
	List<DetailInvoice> detailInvoice;
	
	@ManyToOne
	@JoinColumn(name = "adminId")
	Admin admin; 
	
	@ManyToOne
	@JoinColumn(name = "studentId")
	Student student; 
	
	@ManyToOne
	@JoinColumn(name = "paymentMethodId")
	PaymentMethod paymentMethod; 
}
