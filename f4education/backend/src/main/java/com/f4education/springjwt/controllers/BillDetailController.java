package com.f4education.springjwt.controllers;

import com.f4education.springjwt.payload.request.BillDetailRequestDTO;
import com.f4education.springjwt.payload.request.BillRequestDTO;
import com.f4education.springjwt.payload.response.BillDetailResponseDTO;
import com.f4education.springjwt.payload.response.BillResponseDTO;
import com.f4education.springjwt.security.services.BillDetailServiceImp;
import com.f4education.springjwt.security.services.BillServiceImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/bill-detail")
public class BillDetailController {
    @Autowired
    BillDetailServiceImp billDetailServiceImp;

    @GetMapping
    public List<BillDetailResponseDTO> findAll() {
        return billDetailServiceImp.getAllBillDetail();
    }

    @PostMapping
    public List<BillDetailRequestDTO> createBill(@RequestBody List<BillDetailRequestDTO> billRequest) {
        List<BillDetailRequestDTO> billDTOList = new ArrayList<>();
        for (BillDetailRequestDTO billRequestDTO : billRequest) {
            billDetailServiceImp.createBillDetail(billRequestDTO);
        }
        return billDTOList;
    }
}
