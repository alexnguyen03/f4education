package com.f4education.springjwt.controllers;

import java.io.FileInputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.f4education.springjwt.repository.GoogleDriveRepository;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Blob;

import com.google.cloud.storage.Storage;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.StorageOptions;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/test")
public class TestController {
  @GetMapping("/all")
  public String allAccess() {
    return "Public Content.";
  }

  @Autowired
  GoogleDriveRepository driveRepository;

  @GetMapping("/{imageName}")
  public ResponseEntity<String> getImageUrl(@PathVariable String imageName) throws IOException {
    // serviceAccountKey.json

    StorageOptions storageOptions = StorageOptions.newBuilder()
        .setProjectId("f4education")
        .setCredentials(GoogleCredentials
            .fromStream(new ClassPathResource("serviceAccountKey.json").getInputStream()))
        .build();// f4education\\backend\\src\\main\\resources\\serviceAccountKey.json
    String bucketName = "staging.f4education.appspot.com"; // Thay bằng tên bucket của Firebase Storage
    Storage storage = storageOptions.getService();
    BlobId blobId = BlobId.of(bucketName, imageName);
    Blob blob = storage.get(blobId);

    if (blob == null) {
      return new ResponseEntity<>("Image not found", HttpStatus.NOT_FOUND);
    }

    // Trả về URL của ảnh từ Firebase Storage
    String imageUrl = blob.getMediaLink();
    return new ResponseEntity<>(imageUrl, HttpStatus.OK);
  }

  @GetMapping("/user")
  @PreAuthorize("hasRole('USER') or hasRole('TEACHER') or hasRole('ADMIN')")
  public String userAccess() {
    return "User Content.";
  }

  @GetMapping("/tea")
  @PreAuthorize("hasRole('TEACHER')")
  public String moderatorAccess() {
    return "Moderator Board.";
  }

  @GetMapping("/admin")
  @PreAuthorize("hasRole('ADMIN')")
  public String adminAccess() {
    return "Admin Board.";
  }
}
