package com.f4education.springjwt.interfaces;

import com.f4education.springjwt.payload.request.RegisterCourseRequestDTO;
import com.f4education.springjwt.payload.response.RegisterCourseResponseDTO;
import com.f4education.springjwt.payload.HandleResponseDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RegisterCourseService {
    HandleResponseDTO<List<RegisterCourseResponseDTO>> getAllRegisterCourse();

    HandleResponseDTO<List<RegisterCourseResponseDTO>> findAllRegisterCourseByStudentId(Integer studentId);

    HandleResponseDTO<RegisterCourseResponseDTO> getRegisterCourseById(Integer registerCourseId);

    HandleResponseDTO<RegisterCourseResponseDTO> createRegisterCourse(RegisterCourseRequestDTO registerCourseRequestDTO);

    HandleResponseDTO<RegisterCourseResponseDTO> updateRegisterCourse(Integer registerCourseId, RegisterCourseRequestDTO registerCourseRequestDTO);
}
