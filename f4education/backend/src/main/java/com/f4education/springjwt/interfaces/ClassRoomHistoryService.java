package com.f4education.springjwt.interfaces;

import java.util.List;

import com.f4education.springjwt.payload.request.ClassRoomHistoryDTO;

public interface ClassRoomHistoryService {
	
    List<ClassRoomHistoryDTO> findAll();
    
    List<ClassRoomHistoryDTO> getClassRoomHistoryByClassRoomId(Integer classroomId);
}
