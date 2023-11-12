package com.f4education.springjwt.interfaces;

import java.util.List;

import org.springframework.stereotype.Service;

import com.f4education.springjwt.models.Schedule;
import com.f4education.springjwt.payload.HandleResponseDTO;
import com.f4education.springjwt.payload.request.CourseProgressRequestDTO;
import com.f4education.springjwt.payload.request.RegisterCourseRequestDTO;
import com.f4education.springjwt.payload.request.ScheduleCourseProgressDTO;
import com.f4education.springjwt.payload.response.CourseProgressResponseDTO;
import com.f4education.springjwt.payload.response.RegisterCourseResponseDTO;
import com.f4education.springjwt.payload.response.ScheduleResponse;

@Service
public interface RegisterCourseService {
        HandleResponseDTO<List<RegisterCourseResponseDTO>> getAllRegisterCourse();

        HandleResponseDTO<List<RegisterCourseResponseDTO>> findAllRegisterCourseByStudentId(String studentId);

        HandleResponseDTO<RegisterCourseResponseDTO> getRegisterCourseById(Integer registerCourseId);

        HandleResponseDTO<RegisterCourseResponseDTO> createRegisterCourse(
                        RegisterCourseRequestDTO registerCourseRequestDTO);

        List<RegisterCourseResponseDTO> updateRegisterCourseInClass(
                        RegisterCourseRequestDTO registerCourseRequestDTO);
        // cap nhat lai classId trong register course
        // khi xep hoc vien vao lop

        List<RegisterCourseResponseDTO> getAllRegisterCoursesByCourse_CourseName();

        void grantPermissionsByEmails(String folderName, List<String> emails) throws Exception;

        HandleResponseDTO<RegisterCourseResponseDTO> updateRegisterCourse(Integer registerCourseId,
                        RegisterCourseRequestDTO registerCourseRequestDTO);

        List<CourseProgressResponseDTO> getCourseProgressByStudentID(String studentId);

        List<ScheduleCourseProgressDTO> findAllScheduleByClassId(Integer classId);
}
