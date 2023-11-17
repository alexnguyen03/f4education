package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.f4education.springjwt.models.Bill;
import com.f4education.springjwt.payload.request.BillInformation;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BillRepository extends JpaRepository<Bill, Integer> {
    @Query("SELECT MAX(b.billId) FROM Bill b")
    Integer getMaxBillId();
    
    @Query("SELECT new com.f4education.springjwt.payload.request.BillInformation(hd.billId, sp.courseName, hd.createDate, hd.status, sp.coursePrice, hd.totalPrice, pttt.paymentMethodName) "
			+ "FROM Bill hd " + "JOIN BillDetail hdct ON hd.billId = hdct.bill.billId "
			+ "JOIN Course sp ON hdct.course.courseId = sp.courseId "
			+ "JOIN PaymentMethod pttt ON hd.paymentMethod.paymentMethodId = pttt.paymentMethodId "
			+ "WHERE hd.student.studentId = :studentId AND sp.courseId = :courseId")
	public List<BillInformation> getAllByBillInformation(@Param("studentId") String studentId,
			@Param("courseId") Integer courseId);
}