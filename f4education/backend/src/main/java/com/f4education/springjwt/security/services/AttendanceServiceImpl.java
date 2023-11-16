package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.AttendanceService;
import com.f4education.springjwt.models.Attendance;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.payload.request.AttendanceDTO;
import com.f4education.springjwt.repository.AttendanceReposotory;
import com.f4education.springjwt.repository.ClassRepository;
import com.f4education.springjwt.repository.StudentRepository;

@Service
public class AttendanceServiceImpl implements AttendanceService {
	@Autowired
	private AttendanceReposotory attendanceReposotory;

	@Autowired
	private ClassRepository classReposotory;

	@Autowired
	private StudentRepository studentReposotory;

	@Override
	public List<AttendanceDTO> getAllAttendance() {
		List<Attendance> antendance = attendanceReposotory.findAll();
		return antendance.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
	}

	@Override
	public List<AttendanceDTO> getAttendanceByStudentId(String studentId) {
		List<Attendance> antendance = attendanceReposotory.findAllAttendanceByStudentId(studentId);
		return antendance.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
	}

	@Override
	public AttendanceDTO getAttendanceByAttendanceId(Integer AttendanceId) {
		Optional<Attendance> attendance = attendanceReposotory.findById(AttendanceId);

		if (attendance.isPresent()) {
			return this.convertToResponseDTO(attendance.get());
		}

		return null;
	}

	@Override
	public List<Object[]> getAllByClassId(Integer classId) {
		return attendanceReposotory.getAllByClassId(classId);
	}

	@Override
	public AttendanceDTO createAttendance(AttendanceDTO attendanceDTO) {
		Attendance attendance = this.convertToEntity(attendanceDTO);

		attendance.setAttendanceDate(new Date());
		Attendance newAttendance = attendanceReposotory.save(attendance);

		return this.convertToResponseDTO(newAttendance);
	}

	@Override
	public AttendanceDTO updateAttendance(Integer attendanceId, AttendanceDTO attendanceDTO) {
		Optional<Attendance> exitAttendance = attendanceReposotory.findById(attendanceId);

		if (exitAttendance.isPresent()) {
			Attendance existingAttendancer = exitAttendance.get();

			this.convertToEntity(attendanceDTO, existingAttendancer);

			Attendance savedAttendance = attendanceReposotory.save(existingAttendancer);

			return this.convertToResponseDTO(savedAttendance);
		}
		return null;
	}

	@Override
	public void deleteAttendance(Integer attendanceId) {
		attendanceReposotory.deleteById(attendanceId);
	}

	private AttendanceDTO convertToResponseDTO(Attendance attendance) {
		AttendanceDTO attendanceDTO = new AttendanceDTO();

		BeanUtils.copyProperties(attendance, attendanceDTO);

		attendanceDTO.setClassId(attendance.getClasses().getClassId());
		attendanceDTO.setStudentId(attendance.getStudent().getStudentId());

		return attendanceDTO;
	}

	private Attendance convertToEntity(AttendanceDTO attendanceDTO) {
		Attendance attendance = new Attendance();

		Optional<Classes> classes = classReposotory.findById(attendanceDTO.getClassId());
		Optional<Student> student = studentReposotory.findById(attendanceDTO.getStudentId());

		BeanUtils.copyProperties(attendanceDTO, attendance);

		if (classes.isPresent()) {
			attendance.setClasses(classes.get());
		}

		if (student.isPresent()) {
			attendance.setStudent(student.get());
		}

		return attendance;
	}

	private void convertToEntity(AttendanceDTO attendanceDTO, Attendance attendance) {
		Optional<Classes> classes = classReposotory.findById(attendanceDTO.getClassId());
		Optional<Student> student = studentReposotory.findById(attendanceDTO.getStudentId());

		BeanUtils.copyProperties(attendanceDTO, attendance);

		if (classes.isPresent()) {
			attendance.setClasses(classes.get());
		}

		if (student.isPresent()) {
			attendance.setStudent(student.get());
		}
	}

}
