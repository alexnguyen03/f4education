package com.f4education.springjwt.models;

import java.util.Date;
import java.util.List;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
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
	@Column(name = "bill_id")
	private Integer billId;

	@Column(name = "create_date")
	private Date createDate;

	@Column(name = "end_date")
	private Date endDate;
	
	@Column(name = "total_price")
	private Float totalPrice;
	
	@Column(name = "status")
	private String status;
	
	@Column(name = "note")
	private String note;
	
	@OneToMany(mappedBy = "bill")
	List<DetailInvoice> detailInvoice;
	
	@ManyToOne
	@JoinColumn(name = "admin_id")
	Admin admin; 
	
	@ManyToOne
	@JoinColumn(name = "student_id")
	Student student; 
	
	@ManyToOne
	@JoinColumn(name = "payment_method_id")
	PaymentMethod paymentMethod; 
}