package com.f4education.springjwt.security.services;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.QuestionDetailService;
import com.f4education.springjwt.interfaces.QuestionService;
import com.f4education.springjwt.models.Answer;
import com.f4education.springjwt.models.Question;
import com.f4education.springjwt.models.QuestionDetail;
import com.f4education.springjwt.payload.request.QuestionDetailDTO;
import com.f4education.springjwt.repository.AnswerReposotory;
import com.f4education.springjwt.repository.QuestionDetailReposotory;

@Service
public class QuestionDetailServiceImpl implements QuestionDetailService {
	@Autowired
	QuestionDetailReposotory questionDetailReposotory;

	@Autowired
	AnswerReposotory answerReposotory;

	@Override
	public List<QuestionDetailDTO> getQuestionDetailsByStudentId(String studentId) {
		List<QuestionDetail> questionDetail = questionDetailReposotory.findQuestionDetailByStudentId(studentId);
		return questionDetail.stream().map(this::convertToDto).collect(Collectors.toList());
	}

	private QuestionDetailDTO convertToDto(QuestionDetail questionDetail) {
		QuestionDetailDTO questionDetailDTO = new QuestionDetailDTO();
		BeanUtils.copyProperties(questionDetail, questionDetailDTO);
		questionDetailDTO.setAnswer(questionDetail.getAnswers());
		questionDetailDTO.setCourseId(questionDetail.getQuestion().getCourse().getCourseId());
		questionDetailDTO.setCourseName(questionDetail.getQuestion().getCourse().getCourseName());
		questionDetailDTO.setClassId(questionDetail.getQuestion().getCourse().getRegisterCourses().get(0).getClasses().getClassId());
		questionDetailDTO.setClassName(questionDetail.getQuestion().getCourse().getRegisterCourses().get(0).getClasses().getClassName());
		return questionDetailDTO;
	}

	private QuestionDetail convertDtoToEntity(QuestionDetailDTO questionDetailDTO) {
		QuestionDetail questionDetail = new QuestionDetail();
		BeanUtils.copyProperties(questionDetailDTO, questionDetail);
		questionDetail.setAnswers(questionDetailDTO.getAnswer());
		return questionDetail;
	}
}
