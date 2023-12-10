package com.f4education.springjwt.security.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.TeacherService;
import com.f4education.springjwt.models.Teacher;
import com.f4education.springjwt.models.User;
import com.f4education.springjwt.payload.request.CourseDTO;
import com.f4education.springjwt.payload.request.TeacherDTO;
import com.f4education.springjwt.repository.TeacherRepository;
import com.f4education.springjwt.repository.UserRepository;

@Service
public class TeacherServiceImpl implements TeacherService {

    @Autowired
    private TeacherRepository teacherRepository;

    @Autowired
    private UserRepository userRepository;

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
        User user = userRepository.findById(teacherDTO.getAcccountID()).get();
        teacher.setUser(user);
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

    @Override
    public Teacher findByUserId(String userId) {
        return teacherRepository.findById(userId).get(); // vi ma hien tai la tu tang nen chua lay duoc
    }
}
