package com.f4education.springjwt.security.services;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.interfaces.QuizResultService;
import com.f4education.springjwt.interfaces.ResourceService;
import com.f4education.springjwt.models.Admin;
import com.f4education.springjwt.models.Classes;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.QuizResult;
import com.f4education.springjwt.models.Resources;
import com.f4education.springjwt.models.Student;
import com.f4education.springjwt.payload.request.AdminDTO;
import com.f4education.springjwt.payload.request.CourseRequest;
import com.f4education.springjwt.payload.request.GoogleDriveFileDTO;
import com.f4education.springjwt.payload.request.QuizResultDTO;
import com.f4education.springjwt.payload.request.QuizResultRequest;
import com.f4education.springjwt.payload.request.ResourceRequest;
import com.f4education.springjwt.payload.request.ResourcesDTO;
import com.f4education.springjwt.repository.AdminRepository;
import com.f4education.springjwt.repository.ClassRepository;
import com.f4education.springjwt.repository.CourseRepository;
import com.f4education.springjwt.repository.GoogleDriveRepository;
import com.f4education.springjwt.repository.QuizResultRepository;
import com.f4education.springjwt.repository.ResourceRepository;
import com.f4education.springjwt.repository.StudentRepository;
import com.f4education.springjwt.ultils.ConvertByteToMB;
import com.google.api.services.drive.model.File;

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
}
