package com.f4education.springjwt.security.services;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.TeacherService;
import com.f4education.springjwt.models.Teacher;
import com.f4education.springjwt.payload.request.TeacherDTO;
import com.f4education.springjwt.repository.TeacherRepository;

@Service
public class TeacherServiceImpl implements TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Override
    public List<TeacherDTO> getAllTeachersDTO() {
        return teacherRepository.getAllTeachersDTO();
    }

    @Override
    public TeacherDTO getTeacherDTOByID(String teacherId) {
        return teacherRepository.getTeacherDTOByID(teacherId);
    }

    @Override
    public TeacherDTO createTeacher(TeacherDTO teacherDTO) {
        Teacher teacher = new Teacher();
            
        convertToEntity(teacherDTO, teacher);
        teacherRepository.save(teacher);
        return new TeacherDTO(teacher);
    }

    @Override
    public TeacherDTO updateTeacher(TeacherDTO teacherDTO) {
        Teacher teacher = teacherRepository.findById(teacherDTO.getTeacherId()).get();
        convertToEntity(teacherDTO, teacher);
        teacherRepository.save(teacher);
        return new TeacherDTO(teacher);
    }

    private void convertToEntity(TeacherDTO teacherDTO, Teacher teacher) {
        BeanUtils.copyProperties(teacherDTO, teacher);
    }
}
