package com.f4education.springjwt.security.services;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.AttendanceService;
import com.f4education.springjwt.interfaces.PointService;
import com.f4education.springjwt.interfaces.QuizResultService;
import com.f4education.springjwt.models.AttendanceInfo;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.Point;
import com.f4education.springjwt.models.QuizResultInfo;
import com.f4education.springjwt.models.RegisterCourse;
import com.f4education.springjwt.payload.response.PointDTO;
import com.f4education.springjwt.payload.response.PointResponse;
import com.f4education.springjwt.payload.response.TeacherResultOfStudentResponse;
import com.f4education.springjwt.repository.ClassRepository;
import com.f4education.springjwt.repository.PointRepository;
import com.f4education.springjwt.repository.RegisterCourseRepository;

@Service
public class PointServiceImpl implements PointService {

	@Autowired
	PointRepository pointRepository;

	@Autowired
	QuizResultService quizResultService;

	@Autowired(required = true)
	AttendanceService attendanceService;

	@Autowired()
	ClassRepository classRepository;

	@Autowired
	RegisterCourseRepository registerCourseRepository;

	@Override
	public PointDTO findAllByPointId(Integer pointId) {
		return this.convertEntityToDTO(pointRepository.findById(pointId).get());
	}

	@Override
	public List<PointDTO> findAllByStudentId(String studentId) {
		return pointRepository.findAllByStudentId(studentId).stream().map(this::convertEntityToDTO)
				.collect(Collectors.toList());
	}

	@Override
	public PointResponse findAllByClassId(Integer classId) {

		List<Point> listPoint = pointRepository.findAllByClassId(classId);
		List<Object[]> listAttendance = attendanceService.getAllByClassId(classId);
		List<Object[]> listQuizResult = quizResultService.getQuizInfoByClassId(classId);

		List<AttendanceInfo> attendanceInfoList = listAttendance.stream()
				.map(obj -> new AttendanceInfo((String) obj[0], (Long) obj[1])).collect(Collectors.toList());
		List<QuizResultInfo> quizResultInfoList = listQuizResult.stream()
				.map(obj -> new QuizResultInfo((String) obj[0], (Long) obj[1])).collect(Collectors.toList());

		listPoint.forEach(point -> {
			// kiem tra xem hoc vien co nghi khong, neu co thi tru diem lai
			AttendanceInfo matchingAttendance = attendanceInfoList.stream().filter(
					attendanceInfo -> attendanceInfo.getStudentId().equalsIgnoreCase(point.getStudent().getStudentId()))
					.findFirst().orElse(null);

			if (matchingAttendance != null) {
				point.setAttendancePoint(
						(Math.round((10 - (1.42 * (float) matchingAttendance.getSoNgay())) * 100.0) / 100.0));

			} else {
				point.setAttendancePoint(((double) Math.round(10 * 100.0) / 100.0));

			}
			// set diem quizz tu quiz result
			QuizResultInfo matchingQuiz = quizResultInfoList.stream().filter(
					quizResultInfo -> quizResultInfo.getStudentId().equalsIgnoreCase(point.getStudent().getStudentId()))
					.findFirst().orElse(null);

			if (matchingQuiz != null) {
				point.setQuizzPoint((double) matchingQuiz.getQuizPoint());
			}
			point.setAveragePoint(
					point.getAttendancePoint() * 0.1 + point.getExercisePoint() * 0.5 + point.getQuizzPoint() * 0.4);
		});
		// In ra danh sách Point sau khi cập nhật attendancePoint
		listPoint.forEach(System.out::println);
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
		pointDTO.setAttendancePoint((double) entity.getAttendancePoint());
		pointDTO.setQuizzPoint(entity.getQuizzPoint());
		pointDTO.setAveragePoint(entity.getAveragePoint());
		pointDTO.setStudentId(entity.getStudent().getStudentId());
		pointDTO.setExercisePoint(entity.getExercisePoint());
		pointDTO.setStudentName(entity.getStudent().getFullname());
		pointDTO.setStudentImage(entity.getStudent().getImage());
		List<RegisterCourse> list = registerCourseRepository.findAllByClasses_ClassId(entity.getClasses().getClassId());

		if (list.size() > 0) {
			list.forEach(item -> {
				if (item.getStudent().getStudentId().equals(entity.getStudent().getStudentId())) {
					System.out.println(item.getStudent().getStudentId());
					pointDTO.setRegisterCourseId(item.getRegisterCourseId());
					pointDTO.setCourseName(item.getCourse().getCourseName());
				}
			});
		}

		return pointDTO;
	}

	@Override
	public List<PointDTO> getAllPointByStudentIdAndClassId(String studentId, Integer classId) {
		return pointRepository.findByStudentIdAndCLassId(studentId, classId).stream().map(this::convertToResponse)
				.collect(Collectors.toList());
	}

	private PointDTO convertToResponse(Point point) {
		PointDTO pointDTO = new PointDTO();

		BeanUtils.copyProperties(point, pointDTO);

		return pointDTO;
	}

	private List<TeacherResultOfStudentResponse> convertToTeacherResultOfStudentResponse(Classes classes,
			Integer classId) {
		List<TeacherResultOfStudentResponse> resultList = new ArrayList<>();

		if (classes.getClassId().equals(classId)) {
			for (Point po : classes.getPoints()) {
				TeacherResultOfStudentResponse result = new TeacherResultOfStudentResponse();

//				result.setClasses(classes);
				result.setStudentId(po.getStudent().getStudentId());
				result.setStudentName(po.getStudent().getFullname());
				result.setStudentImg(po.getStudent().getImage());
				result.setAveragePoint(po.getAveragePoint());
				result.setExercisePoint(po.getExercisePoint());
				result.setAttendancePoint(po.getAttendancePoint());
				result.setQuizzPoint(po.getQuizzPoint());

				// Add the result to the list
				resultList.add(result);
			}
		}

		return resultList;
	}

	@Override
	public List<TeacherResultOfStudentResponse> getLearningResultOfStudent(Integer classId) {
		List<Classes> lst = classRepository.getClassWithStudentsAndPoints(classId);
		return lst.stream().flatMap(classes -> convertToTeacherResultOfStudentResponse(classes, classId).stream())
				.collect(Collectors.toList());
	}
}
