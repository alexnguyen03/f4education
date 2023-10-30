package com.f4education.springjwt.controllers;

//Import statements 
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
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
import com.f4education.springjwt.payload.request.QuestionDetailDTO;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/question-detail")
public class QuestionDetailController {
	@Autowired
	QuestionDetailService questionDetailService;

	@PostMapping(value = "/upload-excel", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> uploadExcelFile(@RequestParam("excelFile") Optional<MultipartFile> file) {
		try {
			if (file.isEmpty()) {
				return ResponseEntity.badRequest().body("File not found.");
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

			// Closing file input stream
			fis.close();

			// Print the data from the Excel file
			for (List<Object> rowData : dataList) {
				for (Object cellData : rowData) {
					System.out.print(cellData + "\t");
				}
			}
			
//			LẤY DATA RA RỒI => filter -> lấy distinct theo tiêu đề câu hỏi
//			1 Q => 4 A
			
			return ResponseEntity.ok("Upload Successfully");
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

	public static void main(String[] args) {
		QuestionDetailController qs = new QuestionDetailController();
		qs.uploadExcelFile(null);
	}
}
