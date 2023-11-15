package com.f4education.springjwt.security.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.PointService;
import com.f4education.springjwt.models.Point;
import com.f4education.springjwt.payload.request.PointDTO;
import com.f4education.springjwt.repository.PointRepository;

@Service
public class PointServiceImp implements PointService {
	@Autowired
	PointRepository pointRepository;

	@Override
	public List<PointDTO> getAllPointByStudentIdAndClassId(String studentId, Integer classId) {
		return pointRepository.findByStudentIdAndCLassId(studentId, classId).stream().map(this::convertToResponse).collect(Collectors.toList());
	}
	private PointDTO convertToResponse(Point point) {
		PointDTO pointDTO = new PointDTO();

		BeanUtils.copyProperties(point, pointDTO);

		return pointDTO;
	}

}
