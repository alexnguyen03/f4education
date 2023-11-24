package com.f4education.springjwt.models;

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
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "BillDetail")
public class BillDetail {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "bill_detail_id")
	private Integer billDetailId;

//    private Double price;

	@Column(name = "total_price")
	private Double totalPrice;

	private String note;

	@ManyToOne
	@JoinColumn(name = "course_id")
	@JsonIgnore
	Course course;

	@ManyToOne
	@JoinColumn(name = "bill_id")
	@JsonIgnore
	Bill bill;

	@Override
	public String toString() {
		return "DetailInvoice [detailInvoiceId=" + billDetailId + ", totalPrice=" + totalPrice + ", note=" + note + "]";
	}
}
