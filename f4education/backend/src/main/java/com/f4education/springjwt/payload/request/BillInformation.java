package com.f4education.springjwt.payload.request;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class BillInformation {
    private Integer billId;

    private String courseName;
    
    private Date createDate;
    
    private String status;

    private Float coursePrice;

    private Float totalPrice;
    
    private String paymentMethodName;

	public BillInformation() {
		super();
	}

	public BillInformation(Integer billId, String courseName, Date createDate, String status, Float coursePrice,
			Float totalPrice, String paymentMethodName) {
		super();
		this.billId = billId;
		this.courseName = courseName;
		this.createDate = createDate;
		this.status = status;
		this.coursePrice = coursePrice;
		this.totalPrice = totalPrice;
		this.paymentMethodName = paymentMethodName;
	}

	public Integer getBillId() {
		return billId;
	}

	public void setBillId(Integer billId) {
		this.billId = billId;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public Date getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Date createDate) {
		this.createDate = createDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Float getCoursePrice() {
		return coursePrice;
	}

	public void setCoursePrice(Float coursePrice) {
		this.coursePrice = coursePrice;
	}

	public Float getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(Float totalPrice) {
		this.totalPrice = totalPrice;
	}

	public String getPaymentMethodName() {
		return paymentMethodName;
	}

	public void setPaymentMethodName(String paymentMethodName) {
		this.paymentMethodName = paymentMethodName;
	}

	@Override
	public String toString() {
		return "BillInformation [billId=" + billId + ", courseName=" + courseName + ", createDate=" + createDate
				+ ", status=" + status + ", coursePrice=" + coursePrice + ", totalPrice=" + totalPrice
				+ ", paymentMethodName=" + paymentMethodName + "]";
	}
}
