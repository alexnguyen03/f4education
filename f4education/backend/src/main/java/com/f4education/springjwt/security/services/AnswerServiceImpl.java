package com.f4education.springjwt.security.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.f4education.springjwt.models.QuestionDetail;
import com.f4education.springjwt.repository.QuestionDetailReposotory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import com.f4education.springjwt.interfaces.AnswerService;
import com.f4education.springjwt.models.Answer;
import com.f4education.springjwt.models.QuestionDetail;
import com.f4education.springjwt.payload.request.AnswerDTO;
import com.f4education.springjwt.repository.AnswerReposotory;
import com.f4education.springjwt.repository.QuestionDetailReposotory;

@Service
public class AnswerServiceImpl implements AnswerService {
    @Autowired
    private AnswerReposotory answerReposotory;

    @Autowired
    private QuestionDetailReposotory questionDetailReposotory;

    @Override
    public List<AnswerDTO> getAllAnswer() {
        List<Answer> answers = answerReposotory.findAll();
        return answers.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
    }

    @Override
    public List<AnswerDTO> getAnsweByQuestionDetailId(Integer questionDetailId) {
        List<Answer> answers = answerReposotory.getAllAnswerByQuestionDetailId(questionDetailId);
        return answers.stream().map(this::convertToResponseDTO).collect(Collectors.toList());
    }

    @Override
    public AnswerDTO getAnswerByAnswerId(Integer answerId) {
        return null;
    }

    @Override
    public AnswerDTO createAnswer(AnswerDTO answerDTO) {
        Answer answer = this.convertToEntity(answerDTO);
        System.out.println("ANSWER CREATE: " + answer);

        Answer newAnswer = answerReposotory.save(answer);

        return convertToResponseDTO(newAnswer);
    }

    @Override
    public AnswerDTO updateAnswer(Integer answerId, AnswerDTO answerDTO) {
        Optional<Answer> exitAnswer = answerReposotory.findById(answerId);

        if (exitAnswer.isPresent()) {
            Answer existingAnswer = exitAnswer.get();

            this.convertToEntity(answerDTO, existingAnswer);
            System.out.println(existingAnswer);

            Answer savedAnswer = answerReposotory.save(existingAnswer);

            return convertToResponseDTO(savedAnswer);
        }
        return null;
    }

    @Override
    public void deleteAnswer(Integer answerId) {
        answerReposotory.deleteById(answerId);
    }

    private AnswerDTO convertToResponseDTO(Answer answer) {
        AnswerDTO answerDTO = new AnswerDTO();

        BeanUtils.copyProperties(answer, answerDTO);

        answerDTO.setQuestionDetailId(answer.getQuestionDetail().getQuestionDetailId());

        return answerDTO;
    }

    private Answer convertToEntity(AnswerDTO answerDTO) {
        Answer answer = new Answer();
        QuestionDetail questionDetail = questionDetailReposotory.findById(answerDTO.getQuestionDetailId()).get();

        BeanUtils.copyProperties(answerDTO, answer);

        answer.setQuestionDetail(questionDetail);
        answer.setAnswerContent(answer.getAnswerContent());
        return answer;
    }

    private void convertToEntity(AnswerDTO answerDTO, Answer answer) {
        QuestionDetail questionDetail = questionDetailReposotory.findById(answerDTO.getQuestionDetailId()).get();

        answer.setAnswerContent(answerDTO.getAnswerContent());
        answer.setIsCorrect(answerDTO.getIsCorrect());
        answer.setQuestionDetail(questionDetail);
    }
}
