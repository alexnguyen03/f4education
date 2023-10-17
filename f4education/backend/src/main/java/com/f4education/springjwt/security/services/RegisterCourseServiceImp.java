package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Function;
import java.util.function.Predicate;
import java.util.stream.Collectors;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import com.f4education.springjwt.interfaces.RegisterCourseService;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.RegisterCourse;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.payload.HandleResponseDTO;
import com.f4education.springjwt.payload.request.RegisterCourseRequestDTO;
import com.f4education.springjwt.payload.response.RegisterCourseResponseDTO;
import com.f4education.springjwt.repository.ClassRepository;
import com.f4education.springjwt.repository.CourseRepository;
import com.f4education.springjwt.repository.RegisterCourseRepository;
import com.f4education.springjwt.repository.StudentRepository;

@Service
public class RegisterCourseServiceImp implements RegisterCourseService {
    @Autowired
    private RegisterCourseRepository registerCourseRepository;
    @Autowired
    private CourseRepository courseRepository;
    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ClassRepository classRepository;

    @Override
    public HandleResponseDTO<List<RegisterCourseResponseDTO>> getAllRegisterCourse() {
        List<RegisterCourse> registerCourses = registerCourseRepository.findAll();
        List<RegisterCourseResponseDTO> responseDTOs = registerCourses.stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
        return new HandleResponseDTO<>(HttpStatus.OK.value(), "List RegisterCourse", responseDTOs);
    }

    @Override
    public HandleResponseDTO<List<RegisterCourseResponseDTO>> findAllRegisterCourseByStudentId(Integer studentId) {
        List<RegisterCourse> registerCourses = registerCourseRepository.findByStudentId(studentId);
        if (registerCourses.isEmpty()) {
            return new HandleResponseDTO<>(HttpStatus.BAD_REQUEST.value(), "Student ID cannot be found", null);
        }
        List<RegisterCourseResponseDTO> responseDTOS = registerCourses.stream()
                .map(this::convertToResponseDTO)
                .toList();
        return new HandleResponseDTO<>(HttpStatus.OK.value(), "List RegisterCourse by Student ID", responseDTOS);
    }

    @Override
    public HandleResponseDTO<RegisterCourseResponseDTO> getRegisterCourseById(Integer registerCourseId) {
        Optional<RegisterCourse> registerCourseOptional = registerCourseRepository.findById(registerCourseId);
        if (registerCourseOptional.isEmpty()) {
            return new HandleResponseDTO<>(HttpStatus.BAD_REQUEST.value(), "RegisterCourse ID cannot be found", null);
        }
        RegisterCourse registerCourse = registerCourseOptional.get();
        RegisterCourseResponseDTO responseDTO = convertToResponseDTO(registerCourse);
        return new HandleResponseDTO<>(HttpStatus.OK.value(), "Success", responseDTO);
    }

    @Override
    public HandleResponseDTO<RegisterCourseResponseDTO> createRegisterCourse(
            RegisterCourseRequestDTO registerCourseRequestDTO) {
        Optional<Student> student = studentRepository.findById(registerCourseRequestDTO.getStudentId());
        Optional<Course> course = courseRepository.findById(registerCourseRequestDTO.getCourseId());
        if (student.isEmpty()) {
            return new HandleResponseDTO<>(HttpStatus.BAD_REQUEST.value(), "Student cannot be found", null);
        }
        if (course.isEmpty()) {
            return new HandleResponseDTO<>(HttpStatus.BAD_REQUEST.value(), "Course cannot be found", null);
        }
        RegisterCourse registerCourse = convertRequestToEntity(registerCourseRequestDTO);
        registerCourse.setStatus("Đã đăng ký");
        registerCourse.setRegistrationDate(new Date());
        registerCourse.setClasses(null);
        registerCourse.setStartDate(null);
        registerCourse.setEndDate(null);
        RegisterCourse createdRegisterCourse = registerCourseRepository.save(registerCourse);
        RegisterCourseResponseDTO responseDTO = convertToResponseDTO(createdRegisterCourse);
        System.out.println(createdRegisterCourse);
        return new HandleResponseDTO<>(HttpStatus.CREATED.value(), "Create Success", responseDTO);
    }

    @Override
    public HandleResponseDTO<RegisterCourseResponseDTO> updateRegisterCourse(Integer registerCourseId,
            RegisterCourseRequestDTO registerCourseRequestDTO) {
        Optional<RegisterCourse> registerCourseOptional = registerCourseRepository.findById(registerCourseId);
        if (registerCourseOptional.isEmpty()) {
            return new HandleResponseDTO<>(HttpStatus.BAD_REQUEST.value(), "RegisterCourse ID cannot be found", null);
        }
        RegisterCourse existRegisterCourse = registerCourseOptional.get();
        existRegisterCourse.setStatus("Đã hủy");
        existRegisterCourse.setRegistrationDate(new Date());
        if (!existRegisterCourse.getRegisterCourseId().equals(registerCourseRequestDTO.getRegisterCourseId())) {
            return new HandleResponseDTO<>(HttpStatus.BAD_REQUEST.value(), "RegisterCourse ID mismatch", null);
        }
        convertRequestToEntity(registerCourseRequestDTO, existRegisterCourse);
        RegisterCourse updatedRegisterCourse = registerCourseRepository.save(existRegisterCourse);
        RegisterCourseResponseDTO responseDTO = convertToResponseDTO(updatedRegisterCourse);
        return new HandleResponseDTO<>(HttpStatus.OK.value(), "Update Success", responseDTO);
    }

    private RegisterCourseResponseDTO convertToResponseDTO(RegisterCourse registerCourse) {
        RegisterCourseResponseDTO registerCourseDTO = new RegisterCourseResponseDTO();
        BeanUtils.copyProperties(registerCourse, registerCourseDTO);
        registerCourseDTO.setRegisterCourseId(registerCourse.getRegisterCourseId());
        registerCourseDTO.setStatus(registerCourse.getStatus());
        registerCourseDTO.setNumberSession(registerCourse.getNumberSession());
        registerCourseDTO.setRegistrationDate(registerCourse.getRegistrationDate());
        registerCourseDTO.setCourseDuration(registerCourse.getCourseDuration());
        registerCourseDTO.setCoursePrice(registerCourse.getCoursePrice());
        registerCourseDTO.setCourseDescription(registerCourse.getCourseDescription());
        registerCourseDTO.setImage(registerCourseDTO.getImage());
        registerCourseDTO.setCourseName(registerCourse.getCourse().getCourseName());
        registerCourseDTO.setStudentName(registerCourse.getStudent().getFullname());
        registerCourse.setClasses(registerCourse.getClasses());
        registerCourseDTO.setStartDate(registerCourse.getStartDate());
        registerCourseDTO.setStartDate(registerCourse.getEndDate());
        registerCourseDTO.setNumberSession(registerCourse.getNumberSession());
        registerCourseDTO.setCourseId(registerCourse.getCourse().getCourseId());
        registerCourseDTO.setStudentId(registerCourse.getStudent().getStudentId());
        if (registerCourse.getClasses() != null) {
            registerCourseDTO.setClassId(registerCourse.getClasses().getClassId());
        }
        return registerCourseDTO;
    }

    private RegisterCourse convertRequestToEntity(RegisterCourseRequestDTO registerCourseRequestDTO) {
        RegisterCourse registerCourse = new RegisterCourse();
        Student student = studentRepository.findById(registerCourseRequestDTO.getStudentId()).orElse(null);
        Course course = courseRepository.findById(registerCourseRequestDTO.getCourseId()).orElse(null);
        BeanUtils.copyProperties(registerCourseRequestDTO, registerCourse);
        if (course != null) {
            registerCourse.setCourse(course);
            registerCourse.setCourseDuration(course.getCourseDuration());
            registerCourse.setCoursePrice(course.getCoursePrice());
            registerCourse.setImage(course.getImage());
            registerCourse.setCourseDescription(course.getCourseDescription());
            registerCourse.setNumberSession(course.getNumberSession());
        }
        if (student != null) {
            registerCourse.setStudent(student);
        }
        return registerCourse;
    }

    private void convertRequestToEntity(RegisterCourseRequestDTO registerCourseRequestDTO,
            RegisterCourse registerCourse) {
        Student student = studentRepository.findById(registerCourseRequestDTO.getStudentId()).orElse(null);
        Course course = courseRepository.findById(registerCourseRequestDTO.getCourseId()).orElse(null);
        BeanUtils.copyProperties(registerCourseRequestDTO, registerCourse);
        if (course != null) {
            registerCourse.setCourse(course);
            registerCourse.setCourseDuration(course.getCourseDuration());
            registerCourse.setCoursePrice(course.getCoursePrice());
            registerCourse.setImage(course.getImage());
            registerCourse.setCourseDescription(course.getCourseDescription());
            registerCourse.setNumberSession(course.getNumberSession());
        }
        if (student != null) {
            registerCourse.setStudent(student);
        }
    }

    @Override
    public List<RegisterCourseResponseDTO> getAllRegisterCoursesByCourse_CourseName() {
        return registerCourseRepository.findAll()
                .stream()
                .collect(Collectors.toMap(registration -> registration.getCourse().getCourseId(),
                        registration -> registration, (a, b) -> a))
                .values()
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<RegisterCourseResponseDTO> updateRegisterCourseInClass(
            RegisterCourseRequestDTO registerCourseRequestDTO) {
        List<RegisterCourse> listRegisterCourse = registerCourseRepository
                .findByCourseId(registerCourseRequestDTO.getCourseId());
        List<Integer> listRegisterCourseId = registerCourseRequestDTO.getListRegisterCourseId();
        List<RegisterCourse> filteredRegisterCourses = listRegisterCourse
                .stream()
                .filter(registerCourse -> listRegisterCourseId.contains(registerCourse.getRegisterCourseId()))
                .collect(Collectors.toList());
        Classes foundClass = classRepository.findById(registerCourseRequestDTO.getClassId()).get();
        filteredRegisterCourses.forEach(registerCourse -> {
            registerCourse.setClasses(foundClass);
            registerCourse.setStudent(registerCourse.getStudent());
            registerCourse.setCourse(registerCourse.getCourse());
        });

        return registerCourseRepository.saveAll(filteredRegisterCourses)
                .stream()
                .map(this::convertToResponseDTO)
                .collect(Collectors.toList());

    }
}
