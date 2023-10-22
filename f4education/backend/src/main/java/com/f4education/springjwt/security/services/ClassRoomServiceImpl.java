package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.ClassRoomService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.ClassRoom;
import com.f4education.springjwt.models.ClassRoomHistory;
import com.f4education.springjwt.payload.request.AdminDTO;
import com.f4education.springjwt.payload.request.ClassRoomDTO;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.ClassRoomHistoryRepository;
import com.f4education.springjwt.repository.ClassRoomRepository;

@Service
public class ClassRoomServiceImpl implements ClassRoomService {
	
	@Autowired
	ClassRoomRepository classRoomRepository;

	@Autowired
	ClassRoomHistoryRepository classRoomHistoryRepository;
	
	@Autowired
	private AdminRepository adminRepository;

	@Override
	public List<ClassRoomDTO> findAll() {
		List<ClassRoom> classRooms = classRoomRepository.findAll();
		return classRooms.stream().map(this::convertToDto).collect(Collectors.toList());
	}

	@Override
	public ClassRoomDTO getClassById(Integer classroomId) {
		ClassRoom classRoom = classRoomRepository.findById(classroomId).get();
		return convertToDto(classRoom);
	}
	
	@Override
	public ClassRoomDTO createClass(ClassRoomDTO classroomDTO) {
		String action = "CREATE";
		ClassRoom classRoom = new ClassRoom();
		Admin admin = adminRepository.findById("namnguyen").get();
		convertToEntity(classroomDTO, classRoom);
		classRoom.setAdmin(admin);
		ClassRoom saveClassRoom = classRoomRepository.save(classRoom);
		this.saveClassRoomHistory(saveClassRoom, action);
		return convertToDto(saveClassRoom);
	}

	@Override
	public ClassRoomDTO updateClass(Integer classroomId, ClassRoomDTO classRoomDTO) {
		String action = "UPDATE";
		ClassRoom classRoom = classRoomRepository.findById(classroomId).get();
		convertToEntity(classRoomDTO, classRoom);
		ClassRoom updateClassRoom = classRoomRepository.save(classRoom);
		this.saveClassRoomHistory(updateClassRoom, action);
		return convertToDto(updateClassRoom);
	}
	
	private ClassRoomDTO convertToDto(ClassRoom classRoom ) {
		ClassRoomDTO classRoomDTO = new ClassRoomDTO();
		BeanUtils.copyProperties(classRoom, classRoomDTO);
		Admin admin = adminRepository.findById(classRoom.getAdmin().getAdminId()).get();
		AdminDTO adminDTO = new AdminDTO();
		BeanUtils.copyProperties(admin, adminDTO);
		classRoomDTO.setAdmin(adminDTO);
		return classRoomDTO;
	}
	
	private void convertToEntity(ClassRoomDTO classroomDTO, ClassRoom classRoom) {
		BeanUtils.copyProperties(classroomDTO, classRoom);
	}
	
	private void saveClassRoomHistory(ClassRoom classRoom, String action) {
		ClassRoomHistory classRoomHistory = new ClassRoomHistory();
		BeanUtils.copyProperties(classRoom, classRoomHistory);
		classRoomHistory.setClassRoom(classRoom);
		classRoomHistory.setModifyDate(new Date());
		classRoomHistory.setAction(action);
		classRoomHistory.setAdminId(classRoom.getAdmin().getAdminId());
		classRoomHistoryRepository.save(classRoomHistory);
	}
}
