package com.f4education.springjwt.security.services;

import java.io.IOException;

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

        public static void main(String[] args) {
                try {
                        StorageOptions storageOptions = StorageOptions.newBuilder()
                                        .setProjectId("f4education-p2")
                                        .setCredentials(GoogleCredentials
                                                        .fromStream(new ClassPathResource("serviceAccountKey.json")
                                                                        .getInputStream()))
                                        .build();
                        String bucketName = "f4education-p2.appspot.com";
                        Storage storage = storageOptions.getService();

                        String folderPrefix = "avatars/accounts/";

                        // List the blobs with the specified folder prefix
                        Iterable<Blob> blobs = storage.list(bucketName, Storage.BlobListOption.prefix(folderPrefix))
                                        .iterateAll();

                        // Set Cache-Control header to no-cache for each blob
                        for (Blob blob : blobs) {
                                BlobInfo updatedBlobInfo = blob.toBuilder().setCacheControl("no-cache").build();
                                storage.update(updatedBlobInfo);
                                System.out.println("Cache-Control set to no-cache for: " + blob.getName());
                                Blob updatedBlob = storage.get(bucketName, blob.getName());
                                String cacheControl = updatedBlob.getCacheControl();
                                System.out.println("Cache-Control: " + cacheControl);
                        }
                        // String blobName = "your-blob-name";

                        // Get the blob
                        // Blob blob = storage.get(bucketName, blobName);

                        // Set Cache-Control header to no-cache
                        // BlobInfo updatedBlobInfo =
                        // blob.toBuilder().setCacheControl("no-cache").build();

                        // Update the blob with new Cache-Control header
                        // storage.update(updatedBlobInfo);

                        // System.out.println("Cache-Control set to no-cache for the blob: " +
                        // blobName);

                } catch (Exception e) {
                        // TODO: handle exception

                        e.printStackTrace();
                }
        }
}
