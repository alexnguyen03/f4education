package com.f4education.springjwt.interfaces;

import com.f4education.springjwt.payload.request.BillDetailRequestDTO;
import com.f4education.springjwt.payload.request.BillRequestDTO;
import com.f4education.springjwt.payload.response.BillDetailResponseDTO;
import com.f4education.springjwt.payload.response.BillResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface BillDetailService {
    List<BillDetailResponseDTO> getAllBillDetail();

    BillDetailResponseDTO getBillDetailById(Integer billDetailId);

    BillDetailResponseDTO createBillDetail(BillDetailRequestDTO billRequestDTO);
}
