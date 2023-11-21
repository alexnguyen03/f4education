package com.f4education.springjwt.security.services;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.QuizResultService;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.QuizResult;
import com.f4education.springjwt.models.QuizResultInfo;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.payload.request.QuizResultDTO;
import com.f4education.springjwt.payload.request.QuizResultRequest;
import com.f4education.springjwt.repository.ClassRepository;
import com.f4education.springjwt.repository.CourseRepository;
import com.f4education.springjwt.repository.QuizResultRepository;
import com.f4education.springjwt.repository.StudentRepository;

@Service
public class QuizResultServiceImpl implements QuizResultService {

	@Autowired
	private QuizResultRepository quizResultRepository;

	@Autowired
	private ClassRepository classRepository;

	@Autowired
	private CourseRepository courseRepository;

	@Autowired
	private StudentRepository studentRepository;

	@Override
	public QuizResultDTO createQuizzResult(QuizResultRequest quizResultRequest) {
		QuizResult quizResult = new QuizResult();
		convertToEntity(quizResultRequest, quizResult);
		QuizResult saveQuizResult = quizResultRepository.save(quizResult);
		return convertToDto(saveQuizResult);
	}

	private QuizResultDTO convertToDto(QuizResult quizResult) {
		QuizResultDTO quizResultDTO = new QuizResultDTO();
		BeanUtils.copyProperties(quizResult, quizResultDTO);
		quizResultDTO.setClasses(quizResult.getClasses());
		quizResultDTO.setCourse(quizResult.getCourse());
		quizResultDTO.setStudent(quizResult.getStudent());
		return quizResultDTO;
	}

	private QuizResult convertToEntity(QuizResultRequest quizResultRequest, QuizResult quizResult) {
		BeanUtils.copyProperties(quizResultRequest, quizResult);
		Course course = courseRepository.findById(quizResultRequest.getCourseId()).get();
		Classes classes = classRepository.findById(quizResultRequest.getClassId()).get();
		Student student = studentRepository.findById(quizResultRequest.getStudentId()).get();
		quizResult.setCourse(course);
		quizResult.setClasses(classes);
		quizResult.setStudent(student);
		return quizResult;
	}

	@Override
	public List<Object[]> getQuizInfoByClassId(Integer classId) {

		return quizResultRepository.getAllByClassId(classId);
	}
}
