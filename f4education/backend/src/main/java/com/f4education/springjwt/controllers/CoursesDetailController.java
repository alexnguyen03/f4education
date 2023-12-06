package com.f4education.springjwt.controllers;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.http.HttpStatus;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
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
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.f4education.springjwt.interfaces.CoursesDetailService;
import com.f4education.springjwt.models.Course;
import com.f4education.springjwt.models.CourseDetail;
import com.f4education.springjwt.payload.request.CourseDetailDTO;
import com.f4education.springjwt.repository.CourseDetailRepository;
import com.f4education.springjwt.repository.CourseRepository;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/courses-detail")
@RequiredArgsConstructor
public class CoursesDetailController {
	@Autowired
	CoursesDetailService courseService;

	@Autowired
	CourseDetailRepository courseDetailRepository;

	@Autowired
	CourseRepository courseRepository;

	@GetMapping
	// @PreAuthorize("hasRole('ADMIN')")
	public ResponseEntity<?> getAllCourseDetail() {
		List<CourseDetailDTO> list = courseService.getAllCourseDetail();
		return ResponseEntity.ok(list);
	}

	@GetMapping("/{courseId}")
	public ResponseEntity<?> getAllByCourseId(@PathVariable Integer courseId) {
		List<CourseDetailDTO> list = courseService.getAllCourseDetailByCourseId(courseId);
		return ResponseEntity.ok(list);
	}

	@PostMapping
	public ResponseEntity<?> createCourseDetail(@RequestBody List<CourseDetailDTO> courseDetailDTO) {
		List<CourseDetailDTO> lstCourseDetail = new ArrayList<>();

		for (CourseDetailDTO cd : courseDetailDTO) {
			lstCourseDetail.add(courseService.createCourseDetail(cd));
		}

		if (lstCourseDetail.size() == 0) {
			return ResponseEntity.ok("");
		}

		return ResponseEntity.ok(lstCourseDetail);
	}

	@PutMapping("/{courseDetailId}")
	public ResponseEntity<?> updateCourseDetail(@PathVariable Integer courseDetailId,
			@RequestBody CourseDetailDTO courseDetailDTO) {
		CourseDetailDTO courseDetail = courseService.updateCourseDetail(courseDetailId, courseDetailDTO);

		if (courseDetail == null) {
			return ResponseEntity.badRequest().body("");
		}

		return ResponseEntity.ok(courseDetail);
	}

	@DeleteMapping("/{courseDetailId}")
	public ResponseEntity<?> deleteCourseDetail(@PathVariable Integer courseDetailId) {
		Optional<CourseDetail> existingCourse = courseDetailRepository.findById(courseDetailId);

		if (existingCourse.isPresent()) {
			courseService.deleteCourseDetail(courseDetailId);
			return ResponseEntity.noContent().build();
		}

		return ResponseEntity.badRequest().body("CourseDetail not found");
	}
	
	@PostMapping(value = "/upload-excel/{courseId}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<?> createCourseDetailByExcelImport(@RequestParam("excelFile") Optional<MultipartFile> file,
			@PathVariable Integer courseId) {
		try {

			if (file.isEmpty()) {
				return ResponseEntity.notFound().build();
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

			// Convert data from dataList to courseDetailList
			List<CourseDetailDTO> courseDetailList = new ArrayList<>();
			// List saved CourseDetail
			List<CourseDetailDTO> saveList = new ArrayList<>();

			Course course = courseRepository.findById(courseId).get();
			Integer courseDeration = (Integer) Math.round(course.getCourseDuration() / 4);
			System.out.println(courseDeration);
			if (dataList.size() <= (courseDeration - 1)) {
				System.out.println(dataList.size());
				return ResponseEntity.badRequest().body("CourseDuration_ " + (courseDeration - 1));
			} else {
				for (List<Object> rowData : dataList) {
					CourseDetailDTO courseDetail = new CourseDetailDTO();
					courseDetail.setLessionTitle((String) rowData.get(0));
					courseDetail.setLessionContent((String) rowData.get(1));
					courseDetail.setCourseId(courseId);
					courseDetailList.add(courseDetail);
				}

				if (!courseDetailList.isEmpty()) {
					courseDetailList.remove(0);
					for (CourseDetailDTO c : courseDetailList) {
						saveList.add(courseService.createCourseDetail(c));
					}
				}
			}

			excelFile.delete();

			return ResponseEntity.ok(saveList);
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

	@GetMapping("/download-excel")
	public ResponseEntity<InputStreamResource> downloadExcel() throws IOException {
		// Load Excel file from the resources folder
		ClassPathResource resource = new ClassPathResource("static/excel/courseDetail.xlsx");
		InputStream inputStream = resource.getInputStream();

		// Set up HTTP headers
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
		headers.setContentDispositionFormData("attachment", "courseDetail.xlsx");

		// Create InputStreamResource from the Excel file
		InputStreamResource inputStreamResource = new InputStreamResource(inputStream);

		// Return ResponseEntity with InputStreamResource and headers
		return new ResponseEntity<>(inputStreamResource, headers, HttpStatus.SC_OK);
	}
}
