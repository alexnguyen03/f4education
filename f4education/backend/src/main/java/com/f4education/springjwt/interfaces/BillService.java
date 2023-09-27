package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.payload.request.BillRequestDTO;
import com.f4education.springjwt.payload.response.BillResponseDTO;

@Service
public interface BillService {
	List<BillResponseDTO> getAllBill();

	BillResponseDTO getBillById(Integer billId);

	BillResponseDTO createBill(BillRequestDTO billRequestDTO);

	BillResponseDTO updateBill(Integer billId, BillRequestDTO billRequestDTO);
}
