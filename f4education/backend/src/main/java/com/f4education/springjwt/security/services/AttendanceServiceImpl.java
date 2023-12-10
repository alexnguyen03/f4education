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
import com.f4education.springjwt.models.RegisterCourse;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.payload.request.AttendanceDTO;
import com.f4education.springjwt.payload.response.AttendanceStudentReviewResponse;
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

	@Autowired
	MailerServiceImpl mailer;

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
	public List<AttendanceStudentReviewResponse> getAttendanceForStudentReview(String studentId, Integer classId) {
		List<Attendance> antendance = attendanceReposotory.findAllAttendanceByStudentIdAndClassId(studentId, classId);
		return antendance.stream().map(this::convertToStudentResponseDTO).collect(Collectors.toList());
	}

	private AttendanceStudentReviewResponse convertToStudentResponseDTO(Attendance attendance) {
		AttendanceStudentReviewResponse attendanceDTO = new AttendanceStudentReviewResponse();

		BeanUtils.copyProperties(attendance, attendanceDTO);

		attendanceDTO.setClassId(attendance.getClasses().getClassId());
		attendanceDTO.setClassName(attendance.getClasses().getClassName());

		List<RegisterCourse> rg = attendance.getClasses().getRegisterCourses();

		for (RegisterCourse registerCourse : rg) {
			if (registerCourse.getStudent().getStudentId().equals(attendance.getStudent().getStudentId())
					&& registerCourse.getClasses().getClassId().equals(attendance.getClasses().getClassId())) {
				attendanceDTO.setCourseName(registerCourse.getCourse().getCourseName());
				break;
			}
		}

		return attendanceDTO;
	}

	@Override
	public List<Object[]> getAllByClassId(Integer classId) {
		return attendanceReposotory.getAllByClassId(classId);
	}

	@Override
	public AttendanceDTO createAttendance(AttendanceDTO attendanceDTO) {
		Attendance attendance = this.convertToEntity(attendanceDTO);

		Optional<Student> student = studentReposotory.findById(attendanceDTO.getStudentId());
//		For production
//		String[] listMail = { student.get().getUser().getEmail() };

//		For testing
		String[] listMail = { "hienttpc03323@fpt.edu.vn" };

		attendance.setAttendanceDate(new Date());
		Attendance newAttendance = attendanceReposotory.save(attendance);

//		Send Mail
		Integer absentCount = attendanceReposotory.countAttendanceByClassAndStudent(attendanceDTO.getStudentId(),
				attendanceDTO.getClassId());

		String isPass = absentCount > 7 ? "Bạn đã rớt môn học" : "";

		mailer.queueAttendance(listMail, "", "", absentCount, 7, isPass, newAttendance.getAttendanceDate());

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
