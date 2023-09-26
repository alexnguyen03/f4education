package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.models.Bill;
import com.f4education.springjwt.payload.request.BillRequestDTO;
import com.f4education.springjwt.payload.response.BillResponseDTO;

@Service
public interface BillService {
	List<Bill> getAllBill();

	BillResponseDTO getCartById(Integer billId);

	BillResponseDTO createCart(BillRequestDTO billRequestDTO);
}
