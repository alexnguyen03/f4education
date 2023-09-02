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

import com.f4education.springjwt.interfaces.ClassHistoryService;
import com.f4education.springjwt.interfaces.ClassService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.ClassHistory;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.payload.request.AdminDTO;
import com.f4education.springjwt.payload.request.ClassDTO;
import com.f4education.springjwt.payload.request.ClassHistoryDTO;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.ClassHistoryRepository;
import com.f4education.springjwt.repository.ClassRepository;

@Service
public class ClassHistoryServiceImpl implements ClassHistoryService {

	@Autowired
	ClassHistoryRepository classHistoryRepository;
	
	@Autowired
	private AdminRepository adminRepository;

	@Override
	public List<ClassHistoryDTO> findAll() {
		List<ClassHistory> classHistories = classHistoryRepository.findAll();
		for (ClassHistory classHistory : classHistories) {
			System.out.println(classHistory);
		}
		return classHistories.stream().map(this::convertToDto).collect(Collectors.toList());
	}
	
	private ClassHistoryDTO convertToDto(ClassHistory classHistory ) {
		ClassHistoryDTO classHistoryDTO = new ClassHistoryDTO();
		BeanUtils.copyProperties(classHistory, classHistoryDTO);
		classHistoryDTO.setClassId(classHistory.getClasses().getClassId());
		return classHistoryDTO;
	}
}
