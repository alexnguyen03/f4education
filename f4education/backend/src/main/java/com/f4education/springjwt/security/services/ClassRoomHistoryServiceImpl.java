package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.ClassRoomHistoryService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.ClassRoomHistory;
import com.f4education.springjwt.payload.request.AdminDTO;
import com.f4education.springjwt.payload.request.ClassRoomHistoryDTO;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.ClassRoomHistoryRepository;

@Service
public class ClassRoomHistoryServiceImpl implements ClassRoomHistoryService {

	@Autowired
	ClassRoomHistoryRepository classRoomHistoryRepository;
	
	@Autowired
	private AdminRepository adminRepository;
	
	@Override
	public List<ClassRoomHistoryDTO> findAll() {
		List<ClassRoomHistory> classRoomHistories = classRoomHistoryRepository.findAll();
		for (ClassRoomHistory classRoomHistory : classRoomHistories) {
			System.out.println(classRoomHistory);
		}
		return classRoomHistories.stream().map(this::convertToDto).collect(Collectors.toList());
	}
	
	@Override
	public List<ClassRoomHistoryDTO> getClassRoomHistoryByClassRoomId(Integer classroomId) {
		List<ClassRoomHistory> classRoomHistories = classRoomHistoryRepository.findByClassRoomId(classroomId);
		return classRoomHistories.stream().map(this::convertToDto).collect(Collectors.toList());
	}
	
	private ClassRoomHistoryDTO convertToDto(ClassRoomHistory classRoomHistory ) {
		ClassRoomHistoryDTO classRoomHistoryDTO = new ClassRoomHistoryDTO();
		BeanUtils.copyProperties(classRoomHistory, classRoomHistoryDTO);
		classRoomHistoryDTO.setClassroomId(classRoomHistory.getClassRoom().getClassroomId());
		Admin admin = adminRepository.findById(classRoomHistory.getAdminId()).get();
		AdminDTO adminDTO = new AdminDTO();
		BeanUtils.copyProperties(admin, adminDTO);
		classRoomHistoryDTO.setAdmin(adminDTO);
		return classRoomHistoryDTO;
	}
}
