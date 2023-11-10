package com.f4education.springjwt.security.services;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.PointService;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.Point;
import com.f4education.springjwt.models.RegisterCourse;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.payload.response.PointDTO;
import com.f4education.springjwt.payload.response.PointResponse;
import com.f4education.springjwt.repository.ClassRepository;
import com.f4education.springjwt.repository.PointRepository;

@Service
public class PointServiceImpl implements PointService {

    @Autowired
    PointRepository pointRepository;

    @Autowired
    ClassRepository classRepository;

    @Override
    public PointDTO findAllByPointId(Integer pointId) {
        return this.convertEntityToDTO(pointRepository.findById(pointId).get());
    }

    @Override
    public List<PointDTO> findAllByClassIdAndStudentId(Integer classId, String studentId) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'findAllByClassIdAndStudentId'");
    }

    @Override
    public List<PointDTO> findAllByStudentId(String studentId) {
        return pointRepository.findAllByStudentId(studentId).stream().map(this::convertEntityToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public PointResponse findAllByClassId(Integer classId) {

        List<Point> listPoint = pointRepository.findAllByClassId(classId);

        PointResponse response = new PointResponse();
        response.setClassId(classId);
        response.setListPointsOfStudent(listPoint.stream().map(this::convertEntityToDTO).collect(Collectors.toList()));
        return response;
    }

    @Override
    public List<PointDTO> save(List<Point> listPoint) {
        return pointRepository.saveAll(listPoint).stream().map(this::convertEntityToDTO).collect(Collectors.toList());
    }

    public PointDTO convertEntityToDTO(Point entity) {
        PointDTO pointDTO = new PointDTO();
        pointDTO.setPointId(entity.getPointId());
        pointDTO.setAttendancePoint(entity.getAttendancePoint());
        pointDTO.setQuizzPoint(entity.getQuizzPoint());
        pointDTO.setAveragePoint(entity.getAveragePoint());
        pointDTO.setStudentId(entity.getStudent().getStudentId());
        pointDTO.setExercisePoint(entity.getExercisePoint());
        pointDTO.setStudentName(entity.getStudent().getFullname());
        return pointDTO;
    }

}
