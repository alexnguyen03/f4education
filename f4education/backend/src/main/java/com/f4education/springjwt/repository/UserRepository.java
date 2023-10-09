package com.f4education.springjwt.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.f4education.springjwt.models.User;
import com.f4education.springjwt.payload.request.AccountDTO;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
  Optional<User> findByUsername(String username);

  Boolean existsByUsername(String username);

  Boolean existsByEmail(String email);

  public User findByEmail(String email);

  @Query("SELECT new com.f4education.springjwt.payload.request.AccountDTO(o) FROM User o")
  List<AccountDTO> getAllAcountsDTO();
}
