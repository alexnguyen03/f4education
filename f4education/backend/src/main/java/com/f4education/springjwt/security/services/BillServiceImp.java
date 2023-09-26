package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.BillService;
import com.f4education.springjwt.models.Bill;
import com.f4education.springjwt.models.Cart;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.PaymentMethod;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.payload.request.BillRequestDTO;
import com.f4education.springjwt.payload.request.CartRequestDTO;
import com.f4education.springjwt.payload.response.BillResponseDTO;
import com.f4education.springjwt.repository.BillRepository;
import com.f4education.springjwt.repository.PaymentMethodRepository;

@Service
public class BillServiceImp implements BillService {
	@Autowired
	private BillRepository billRepository;

	@Autowired
	private PaymentMethodRepository paymentMethodRepository;

	@Override
	public List<Bill> getAllBill() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public BillResponseDTO getCartById(Integer billId) {
		Bill bill = billRepository.findById(billId).get();

		if (bill != null) {
			ResponseEntity.status(HttpStatus.BAD_REQUEST).body("message: Bill Id can not be found");
		}
		return convertToReponseDTO(bill);
	}

	@Override
	public BillResponseDTO createCart(BillRequestDTO billRequestDTO) {
		Bill bill = this.convertRequestToEntity(billRequestDTO);

		bill.setCreateDate(new Date());

		Bill newBill = billRepository.save(bill);
		return convertToReponseDTO(newBill);
	}

	private BillResponseDTO convertToReponseDTO(Bill bill) {
		BillResponseDTO billRespDTO = new BillResponseDTO();

		PaymentMethod paymentMethod = paymentMethodRepository.findById(bill.getPaymentMethod().getPaymentMethodId())
				.get();

		BeanUtils.copyProperties(bill, billRespDTO);

		billRespDTO.setPaymentMethod(paymentMethod.getPaymentMethodName());

		return billRespDTO;
	}

	private Bill convertRequestToEntity(BillRequestDTO billRequestDTO) {
		Bill bill = new Bill();

		PaymentMethod paymentMethod = paymentMethodRepository
				.findByPaymentMethodName(billRequestDTO.getCheckoutMethod());
		Student student = new Student(1, "Nguyễn Văn An", true, "Cần Thơ, California", "0839475920", "img.png");

		BeanUtils.copyProperties(billRequestDTO, bill);

		bill.setNote("");
		bill.setPaymentMethod(paymentMethod);
		bill.setStudent(student);

		return bill;
	}

}
