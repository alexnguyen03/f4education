package com.f4education.springjwt.controllers;

import com.f4education.springjwt.interfaces.AnswerService;
import com.f4education.springjwt.interfaces.QuestionDetailService;
import com.f4education.springjwt.models.Answer;
import com.f4education.springjwt.payload.request.AnswerDTO;
import com.f4education.springjwt.payload.request.QuestionDetailDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/question-detail")
public class QuestionDetailController {
	@Autowired
	QuestionDetailService questionDetailService;

	@Autowired
	AnswerService answerService;

	@GetMapping
//	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> findAll() {
		List<QuestionDetailDTO> questionDetail = questionDetailService.findAll();
		return ResponseEntity.ok(questionDetail);
	}

	@GetMapping("/{questionId}")
//	@PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> findAllByQuestionID(@PathVariable Integer questionId) {
		List<QuestionDetailDTO> questionDetail = questionDetailService.getAllQuestionDetailByQuestionId(questionId);
		return ResponseEntity.ok(questionDetail);
	}

	@PostMapping
	public ResponseEntity<?> createQuestion(@RequestBody QuestionDetailDTO questionDetailDTO) {
		QuestionDetailDTO questionDetail = questionDetailService.createQuestionDetail(questionDetailDTO);
		return ResponseEntity.ok(questionDetail);
	}

	@PutMapping("/{questionDetailId}")
	public ResponseEntity<?> updateQuestion(@PathVariable("questionDetailId") Integer questionDetailId,
			@RequestBody QuestionDetailDTO questionDetailDTO) {
		QuestionDetailDTO questionDetail = questionDetailService.updateQuestionDetail(questionDetailId,
				questionDetailDTO);
		return ResponseEntity.ok(questionDetail);
	}

	@DeleteMapping("{questionDetailId}")
	public ResponseEntity<?> deleteQuestion(@PathVariable Integer questionDetailId) {
		QuestionDetailDTO questionDetail = questionDetailService.deleteQuestion(questionDetailId);

		if (questionDetail == null) {
			return ResponseEntity.badRequest().body("Question does not exist");
		}

		return ResponseEntity.noContent().build();
	}

	@PostMapping(value = "/upload-excel", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> uploadExcelFile(@RequestParam("excelFile") Optional<MultipartFile> file) {
		try {
			Workbook workbook = WorkbookFactory.create(file.getInputStream());
			Sheet sheet = workbook.getSheetAt(0); // Lấy sheet đầu tiên

			Iterator<Row> rowIterator = sheet.iterator();
			rowIterator.next(); // Bỏ qua dòng tiêu đề

			while (rowIterator.hasNext()) {
				Row row = rowIterator.next();

				String questionTitle = row.getCell(0).getStringCellValue();
				int questionId = (int) row.getCell(1).getNumericCellValue();
				String answerContent = row.getCell(2).getStringCellValue();
				boolean isCorrect = row.getCell(3).getBooleanCellValue();

				// Tiếp tục xử lý dữ liệu và lưu câu hỏi và đáp án vào cơ sở dữ liệu
				// ...
			}

			workbook.close();

			return ResponseEntity.ok("Upload Successfully");
		} catch (Exception e) {
			return ResponseEntity.badRequest().body("Error");
		}

	}

}
