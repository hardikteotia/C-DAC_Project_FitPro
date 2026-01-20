package com.fitpro.backend.controller;

import com.fitpro.backend.entity.Attendance;
import com.fitpro.backend.entity.Member;
import com.fitpro.backend.repository.AttendanceRepository;
import com.fitpro.backend.repository.MemberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepo;
    @Autowired
    private MemberRepository memberRepo;

    // Mark Attendance (POST /api/attendance?memberId=1&status=Present)
    @PostMapping
    public Attendance markAttendance(@RequestParam Long memberId, @RequestParam String status) {
        Member member = memberRepo.findById(memberId).orElseThrow(() -> new RuntimeException("Member not found"));
        
        Attendance attendance = new Attendance();
        attendance.setDate(LocalDate.now());
        attendance.setStatus(status);
        attendance.setMember(member);
        
        return attendanceRepo.save(attendance);
    }

    // Get History (GET /api/attendance/1)
    @GetMapping("/{memberId}")
    public List<Attendance> getHistory(@PathVariable Long memberId) {
        return attendanceRepo.findByMemberId(memberId);
    }
}