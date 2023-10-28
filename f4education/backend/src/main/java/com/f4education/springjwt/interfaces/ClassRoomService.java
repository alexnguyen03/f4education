package com.f4education.springjwt.interfaces;

import java.util.Date;
import java.util.List;
import com.f4education.springjwt.payload.request.ClassRoomDTO;

public interface ClassRoomService {
    List<ClassRoomDTO> findAll();

    ClassRoomDTO getClassById(Integer classroomId);

    List<Object[]> getClassByNotInScheduleBySessionId(Date startDate);

    ClassRoomDTO createClass(ClassRoomDTO classRoomDTO);

    ClassRoomDTO updateClass(Integer classroomId, ClassRoomDTO classRoomDTO);
}
