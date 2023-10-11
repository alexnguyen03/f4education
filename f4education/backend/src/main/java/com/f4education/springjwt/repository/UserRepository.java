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

  @Query("SELECT o FROM User o WHERE o.id = ?1")
  User findByID(Long id);

  @Query("SELECT new com.f4education.springjwt.payload.request.AccountDTO(o.user) FROM Account_role o")
  List<AccountDTO> getAllAcountsDTO();

  @Query("SELECT new com.f4education.springjwt.payload.request.AccountDTO(o.user) FROM Account_role o WHERE o.role.id = ?1")
  List<AccountDTO> getAllAccountsDTOByRole(Integer role);
}
