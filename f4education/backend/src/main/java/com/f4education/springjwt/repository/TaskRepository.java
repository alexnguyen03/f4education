package com.f4education.springjwt.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.f4education.springjwt.models.Task;

public interface TaskRepository extends JpaRepository<Task, Integer> {
	@Query("SELECT t FROM Task t WHERE t.classes.classId = :classId")
	List<Task> findByClassId(@Param("classId") Integer classId);

	@Query("SELECT o FROM Task o where o.classes.classId = :classId")
	List<Task> getAll(@Param("classId") Integer id);

	@Query("SELECT o FROM Task o where o.classes.classId = :classId AND o.title = :taskTile")
	Task exitTaskByTaskTitleAndClassId(@Param("classId") Integer classId, @Param("taskTile") String taskTile);
}
