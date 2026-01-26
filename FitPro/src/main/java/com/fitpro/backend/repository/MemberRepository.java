package com.fitpro.backend.repository;

import com.fitpro.backend.entity.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> {
    List<Member> findByActiveTrue(); // Fetch only active members
}
