package com.f4education.springjwt.security.services;

import java.io.IOException;
import java.text.Normalizer;
import java.text.Normalizer.Form;
import java.util.ArrayList;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.BlobInfo;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

@Service
public class FirebaseStorageService {

        public String uploadImage(MultipartFile file, String folderPath, String fileName) throws IOException {
                // Load tệp tin service account key
                StorageOptions storageOptions = StorageOptions.newBuilder()
                                .setProjectId("f4education-p2")
                                .setCredentials(GoogleCredentials
                                                .fromStream(new ClassPathResource("serviceAccountKey.json")
                                                                .getInputStream()))
                                .build();
                String bucketName = "f4education-p2.appspot.com";
                Storage storage = storageOptions.getService();

                // Tạo BlobId với đường dẫn thư mục và tên file
                BlobId blobId = BlobId.of(bucketName, "avatars/" + folderPath + fileName);
                BlobInfo blobInfo = BlobInfo.newBuilder(blobId).setContentType(file.getContentType()).build();
                // Xác định đường dẫn tới file trong bucket
                Blob blob = storage.get(bucketName, "avatars/" + folderPath + fileName); // Thay đường dẫn tới file bạn
                                                                                         // muốn xóa

                // Xóa file
                if (blob != null) {
                        blob.delete();
                        System.out.println("File đã được xóa thành công.");

                } else {
                        System.out.println("File không tồn tại.");
                }
                blob = storage.create(blobInfo, file.getBytes());
                // remove caching in google cloud service
                this.isUpdatedNoCahe(folderPath);
                // Lấy URL để truy cập file sau khi upload
                return blob.getMediaLink();
        }

        public Boolean isUpdatedNoCahe(String rootFolder) {
                Boolean isUpdated = true;
                try {
                        StorageOptions storageOptions = StorageOptions.newBuilder()
                                        .setProjectId("f4education-p2")
                                        .setCredentials(GoogleCredentials
                                                        .fromStream(new ClassPathResource("serviceAccountKey.json")
                                                                        .getInputStream()))
                                        .build();
                        String bucketName = "f4education-p2.appspot.com";
                        Storage storage = storageOptions.getService();

                        String folderPrefix = rootFolder;

                        // List the blobs with the specified folder prefix
                        Iterable<Blob> blobs = storage.list(bucketName, Storage.BlobListOption.prefix(folderPrefix))
                                        .iterateAll();

                        System.out.println("============= update cache");
                        // Set Cache-Control header to no-cache for each blob
                        for (Blob blob : blobs) {
                                BlobInfo updatedBlobInfo = blob.toBuilder().setCacheControl("no-cache").build();
                                System.out.println("Cache-Control set to no-cache for: " + blob.getName());
                                storage.update(updatedBlobInfo);
                                Blob updatedBlob = storage.get(bucketName, blob.getName());
                                String cacheControl = updatedBlob.getCacheControl();
                                System.out.println("Cache-Control: " + cacheControl);
                        }

                } catch (Exception e) {
                        // TODO: handle exception

                        e.printStackTrace();
                        isUpdated = false;
                }
                return isUpdated;
        }

        // public static String createUsername(String fullName) {
        // String processedName = Normalizer.normalize(fullName, Form.NFD)
        // .replaceAll("\\p{InCombiningDiacriticalMarks}+", "").replaceAll("đ", "d")
        // .replaceAll("Đ", "D");

        // String result = createNewString(processedName.toLowerCase());
        // return result;
        // }

        // public static String createNewString(String input) {
        // String[] words = input.split(" ");
        // StringBuilder newString = new StringBuilder();

        // if (words.length > 0) {
        // newString.append(words[words.length - 1]); // Thêm từ cuối đầu tiên vào chuỗi
        // mới

        // // Thêm từng ký tự đầu của các từ còn lại vào chuỗi mới
        // for (int i = 0; i < words.length - 1; i++) {
        // if (!words[i].isEmpty()) {
        // newString.append(words[i].charAt(0)); // Thêm ký tự đầu của từ
        // }
        // }
        // }

        // return newString.toString();
        // }

        // public static void main(String[] args) {
        // ArrayList<String> danhSachTenVaGioiTinh = new ArrayList<>();

        // // Thêm thông tin vào ArrayList
        // danhSachTenVaGioiTinh.add(new String("Nguyễn Văn An"));
        // danhSachTenVaGioiTinh.add(new String("Trần Thị Bình"));
        // danhSachTenVaGioiTinh.add(new String("Lê Văn Chiến"));
        // danhSachTenVaGioiTinh.add(new String("Phạm Thị Dung"));
        // danhSachTenVaGioiTinh.add(new String("Hoàng Văn Em"));
        // danhSachTenVaGioiTinh.add(new String("Vũ Thị Phương"));
        // danhSachTenVaGioiTinh.add(new String("Đặng Văn Giang"));
        // danhSachTenVaGioiTinh.add(new String("Bùi Thị Hoa"));
        // danhSachTenVaGioiTinh.add(new String("Đỗ Văn Ích"));
        // danhSachTenVaGioiTinh.add(new String("Ngô Thị Khanh"));
        // danhSachTenVaGioiTinh.add(new String("Hồ Văn Long"));
        // danhSachTenVaGioiTinh.add(new String("Dương Thị Mai"));
        // danhSachTenVaGioiTinh.add(new String("Mai Văn Nam"));
        // danhSachTenVaGioiTinh.add(new String("Lý Thị Phượng"));
        // danhSachTenVaGioiTinh.add(new String("Trịnh Văn Quân"));
        // danhSachTenVaGioiTinh.add(new String("Phan Thị Linh"));
        // danhSachTenVaGioiTinh.add(new String("Đinh Văn Sơn"));
        // danhSachTenVaGioiTinh.add(new String("Trương Thị Thảo"));
        // danhSachTenVaGioiTinh.add(new String("Võ Văn Uyên"));
        // danhSachTenVaGioiTinh.add(new String("Đào Thị Vy"));

        // // In danh sách tên và giới tính từ ArrayList
        // for (String string : danhSachTenVaGioiTinh) {
        // System.out.println(createUsername(string));

        // }
        // }
}
