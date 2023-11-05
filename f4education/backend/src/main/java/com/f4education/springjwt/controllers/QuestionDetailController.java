package com.f4education.springjwt.controllers;

//Import statements 
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.interfaces.AnswerService;
import com.f4education.springjwt.interfaces.QuestionDetailService;
import com.f4education.springjwt.models.Answer;
import com.f4education.springjwt.payload.request.QuestionDetailDTO;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/question-detail")
public class QuestionDetailController {
	@Autowired
	QuestionDetailService questionDetailService;

	@Autowired
	AnswerService answerService;

	@GetMapping
	// @PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> findAll() {
		List<QuestionDetailDTO> questionDetail = questionDetailService.findAll();
		return ResponseEntity.ok(questionDetail);
	}

	@GetMapping("/{questionId}")
	// @PreAuthorize("hasRole('ADMIN')")
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

	@PostMapping(value = "/upload-excel/{questionId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> uploadExcelFile(@RequestParam("excelFile") Optional<MultipartFile> file,
			@PathVariable Integer questionId) {
		try {
			if (file.isEmpty()) {
				return ResponseEntity.noContent().build();
			}

			// Get the file from the MultipartFile object
			File excelFile = convertMultipartFileToFile(file.get());

			// Create a FileInputStream to read the Excel file
			FileInputStream fis = new FileInputStream(excelFile);

			// Create a Workbook instance based on the file
			Workbook workbook = new XSSFWorkbook(fis);

			// Get the first sheet from the workbook
			Sheet sheet = workbook.getSheetAt(0);

			// Create a list to store the data from the Excel file
			List<List<Object>> dataList = new ArrayList<>();

			// Iterate through each row in the sheet
			for (Row row : sheet) {
				List<Object> rowData = new ArrayList<>();

				// Iterate through each cell in the row
				for (Cell cell : row) {
					Object cellValue = getCellValue(cell);
					rowData.add(cellValue);
				}

				dataList.add(rowData);
			}

			// Create a list to hold QuestionDetailDTO objects
			List<QuestionDetailDTO> questionDetails = new ArrayList<>();

			if (dataList.size() > 0) {
				for (int i = 1; i < dataList.size(); i++) {
					List<Object> row = dataList.get(i);

					if (row.size() >= 3) {
						String questionTitle = (String) row.get(0);
						String answerContent = (String) row.get(1);
						Boolean isCorrect = (Boolean) row.get(2);

						// Check if the question already exists in the list
						QuestionDetailDTO existingQuestion = questionDetails.stream()
								.filter(q -> q.getQuestionTitle().equals(questionTitle)).findFirst().orElse(null);

						if (existingQuestion == null) {
							// If the question doesn't exist, create a new QuestionDetailDTO
							QuestionDetailDTO newQuestion = new QuestionDetailDTO();
							newQuestion.setQuestionTitle(questionTitle);
							newQuestion.setAnswers(new ArrayList<>()); // Initialize the answers list
							Answer newAnswer = new Answer();
							newAnswer.setAnswerContent(answerContent);
							newAnswer.setIsCorrect(isCorrect);
							newQuestion.getAnswers().add(newAnswer);
							newQuestion.setCreateDate(new Date());
							newQuestion.setQuestionId(questionId);
							// Add the new question to the list
							questionDetails.add(newQuestion);
						} else {
							// If the question exists, add the answer to its list of answers
							Answer newAnswer = new Answer();
							newAnswer.setAnswerContent(answerContent);
							newAnswer.setIsCorrect(isCorrect);
							existingQuestion.getAnswers().add(newAnswer);
						}
					} else {
						System.out.println("Row does not have enough columns for processing");
						continue;
					}
				}
			}

			// Closing file input stream
			fis.close();

			List<QuestionDetailDTO> resultList = new ArrayList<>();
			// Print the data from the Excel file
			for (QuestionDetailDTO questionDetail : questionDetails) {
				resultList.add(questionDetailService.createQuestionDetail(questionDetail));
			}

			excelFile.delete();

			return ResponseEntity.ok(resultList);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.badRequest().body("Error");
		}
	}

	private Object getCellValue(Cell cell) {
		switch (cell.getCellType()) {
			case NUMERIC:
				return cell.getNumericCellValue();
			case STRING:
				return cell.getStringCellValue();
			case BOOLEAN:
				return cell.getBooleanCellValue();
			default:
				return null;
		}
	}

	private File convertMultipartFileToFile(MultipartFile multipartFile) throws IOException {
		File file = new File(multipartFile.getOriginalFilename());
		FileOutputStream fos = new FileOutputStream(file);
		fos.write(multipartFile.getBytes());
		fos.close();
		return file;
	}

}
