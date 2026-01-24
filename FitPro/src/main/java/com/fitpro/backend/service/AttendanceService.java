package com.fitpro.backend.service;

import com.fitpro.backend.entity.Attendance;
import com.fitpro.backend.entity.Member;
import com.fitpro.backend.repository.AttendanceRepository;
import com.fitpro.backend.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepo;

    @Autowired
    private MemberRepository memberRepo;

    // 1. MARK ATTENDANCE
    public Attendance markAttendance(Long memberId, String status) {
        Member member = memberRepo.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        Attendance attendance = new Attendance();
        attendance.setDate(LocalDate.now());
        attendance.setStatus(status); // "Present" or "Absent"
        attendance.setMember(member);

        return attendanceRepo.save(attendance);
    }

    // 2. GET HISTORY
    public List<Attendance> getAttendanceHistory(Long memberId) {
        return attendanceRepo.findByMemberId(memberId);
    }
}