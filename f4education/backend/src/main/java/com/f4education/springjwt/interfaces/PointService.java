package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.models.Point;
import com.f4education.springjwt.payload.request.PointRequestDTO;
import com.f4education.springjwt.payload.response.PointDTO;
import com.f4education.springjwt.payload.response.PointResponse;

@Service
public interface PointService {
	List<PointDTO> getAllPointByStudentIdAndClassId(String studentId, Integer classId);

    public PointDTO findAllByPointId(Integer pointId);

    public List<PointDTO> save(List<Point> listPoint);

    public List<PointDTO> findAllByStudentId(String studentId);

    public PointResponse findAllByClassId(Integer classId);

}
