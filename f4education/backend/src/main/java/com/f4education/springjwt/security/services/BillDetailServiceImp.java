package com.f4education.springjwt.security.services;

import com.f4education.springjwt.interfaces.BillDetailService;
import com.f4education.springjwt.models.*;
import com.f4education.springjwt.payload.request.BillDetailRequestDTO;
import com.f4education.springjwt.payload.response.BillDetailResponseDTO;
import com.f4education.springjwt.repository.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BillDetailServiceImp implements BillDetailService {
	@Autowired
	private BillDetailRepository billDetailRepository;

	@Autowired
	private BillRepository billRepository;

	@Autowired
	private CourseRepository courseRepository;

	@Override
	public List<BillDetailResponseDTO> getAllBillDetail() {
		return billDetailRepository.findAll().stream().map(this::convertToListReponseDTO).collect(Collectors.toList());
	}

	@Override
	public BillDetailResponseDTO getBillDetailById(Integer billDetailId) {
		Optional<BillDetail> billDetailOptional = billDetailRepository.findById(billDetailId);
		if (billDetailOptional.isPresent()) {
			BillDetail billDetail = billDetailOptional.get();
			return this.convertToListReponseDTO(billDetail);
		}
		return null;
	}

	@Override
	public BillDetailResponseDTO createBillDetail(BillDetailRequestDTO billDetailRequestDTO) {
		BillDetail billDetail = this.convertRequestToEntity(billDetailRequestDTO);

		Integer billId = billRepository.getMaxBillId();
		Bill bill = billRepository.findById(billId).get();

		billDetail.setBill(bill);

		BillDetail newBill = billDetailRepository.save(billDetail);
		return this.convertToListReponseDTO(newBill);
	}

	private BillDetailResponseDTO convertToListReponseDTO(BillDetail bill) {
		BillDetailResponseDTO billDetailResponseDTO = new BillDetailResponseDTO();

		BeanUtils.copyProperties(bill, billDetailResponseDTO);

		billDetailResponseDTO.setBillDetailId(bill.getBillDetailId());
		billDetailResponseDTO.setCourse(bill.getCourse());
		billDetailResponseDTO.setTotalPrice(bill.getTotalPrice());

		return billDetailResponseDTO;
	}

//	private BillDetailResponseDTO convertToResponseDTO(BillDetail bill) {
//		BillDetailRequestDTO billDetailResponseDTO = new BillDetailRequestDTO();
//
//		BeanUtils.copyProperties(bill, billDetailResponseDTO);
//
//		billDetailResponseDTO.setCourseId(bill.getCourse().getCourseId());
//		billDetailResponseDTO.setTotalPrice(bill.getTotalPrice());
//
//		return billDetailResponseDTO;
//	}

	private BillDetail convertRequestToEntity(BillDetailRequestDTO billDetailRequestDTO) {
		BillDetail billDetail = new BillDetail();

		Course course = courseRepository.findById(billDetailRequestDTO.getCourseId()).get();

		BeanUtils.copyProperties(billDetailRequestDTO, billDetail);

		billDetail.setTotalPrice(billDetailRequestDTO.getTotalPrice());
		billDetail.setCourse(course);

		return billDetail;
	}
}
