package com.fitpro.backend.repository;

import com.fitpro.backend.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByMemberId(Long memberId);
}
