package com.f4education.springjwt.security.services;

import com.f4education.springjwt.interfaces.QuestionDetailService;
import com.f4education.springjwt.models.Question;
import com.f4education.springjwt.models.QuestionDetail;
import com.f4education.springjwt.payload.request.QuestionDetailDTO;
import com.f4education.springjwt.repository.AnswerReposotory;
import com.f4education.springjwt.repository.QuestionDetailReposotory;
import com.f4education.springjwt.repository.QuestionReposotory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class QuestionDetailServiceImpl implements QuestionDetailService {
    @Autowired
    QuestionDetailReposotory questionDetailReposotory;

    @Autowired
    AnswerReposotory answerReposotory;

    @Autowired
    QuestionReposotory questionReposotory;

    @Override
    public List<QuestionDetailDTO> getAllQuestionDetailByQuestionId(Integer questionId) {
        List<QuestionDetail> questionDetail = questionDetailReposotory.findAllQuestionDetailByQuestionId(questionId);
        return questionDetail.stream().map(this::convertToQuestionDetailResponse).collect(Collectors.toList());
    }

    @Override
    public QuestionDetailDTO getQuestionDetailById(Integer questionDetailId) {
        QuestionDetail questionDetail = questionDetailReposotory.findById(questionDetailId).get();
        return this.convertToQuestionDetailResponse(questionDetail);
    }

    @Override
    public QuestionDetailDTO createQuestionDetail(QuestionDetailDTO questionDetailDTO) {
        QuestionDetail questionDetail = this.convertDTOtoEntity(questionDetailDTO);
        questionDetail.setCreateDate(new Date());
        questionDetail.setAnswer(null);

        QuestionDetail saveQuestionDetail = questionDetailReposotory.save(questionDetail);

//        if (saveQuestion.getAnswer().size() > 0) {
//            for (Answer as : saveQuestion.getAnswer()) {
//                as.setQuestion(saveQuestion);
//                answerReposotory.save(as);
//            }
//        }

        return convertToQuestionDetailResponse(saveQuestionDetail);
    }

    @Override
    public QuestionDetailDTO updateQuestionDetail(Integer questionDetailId, QuestionDetailDTO questionDetailDTO) {
        Optional<QuestionDetail> questionDetail = questionDetailReposotory.findById(questionDetailId);

        if (questionDetail.isPresent()) {
            QuestionDetail exitQuestionDetail = questionDetail.get();

            this.convertDTOtoEntity(questionDetailDTO, exitQuestionDetail);

            QuestionDetail updateQuestionDetail = questionDetailReposotory.save(exitQuestionDetail);
            return convertToQuestionDetailResponse(updateQuestionDetail);
        }
        return null;
    }

    private QuestionDetail convertDTOtoEntity(QuestionDetailDTO questionDetailDTO) {
        QuestionDetail questionDetail = new QuestionDetail();

        Optional<Question> question = questionReposotory.findById(questionDetailDTO.getQuestionId());

        BeanUtils.copyProperties(questionDetailDTO, questionDetail);

        question.ifPresent(questionDetail::setQuestion);

        return questionDetail;
    }

    private void convertDTOtoEntity(QuestionDetailDTO questionDetailDTO, QuestionDetail questionDetail) {
        Optional<Question> question = questionReposotory.findById(questionDetailDTO.getQuestionId());

        question.ifPresent(questionDetail::setQuestion);
        questionDetail.setQuestionTitle(questionDetail.getQuestionTitle());
        questionDetail.setAnswer(questionDetailDTO.getAnswers());
        questionDetail.setCreateDate(questionDetailDTO.getCreateDate());
    }

    private QuestionDetailDTO convertToQuestionDetailResponse(QuestionDetail questionDetail) {
        QuestionDetailDTO questionDetailDTO = new QuestionDetailDTO();

        BeanUtils.copyProperties(questionDetail, questionDetailDTO);

        questionDetailDTO.setQuestionId(questionDetail.getQuestion().getQuestionId());
        questionDetailDTO.setAnswers(questionDetail.getAnswer());

        return questionDetailDTO;
    }
}
