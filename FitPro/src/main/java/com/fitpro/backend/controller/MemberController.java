package com.fitpro.backend.controller;

import com.fitpro.backend.dto.MemberRegistrationRequest;
import com.fitpro.backend.entity.Member;
import com.fitpro.backend.service.MemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@CrossOrigin(origins = "http://localhost:5173") // Allow React (Vite) to talk to us
public class MemberController {

    @Autowired
    private MemberService memberService;

    @PostMapping("/register")
    public Member register(@RequestBody MemberRegistrationRequest request) {
        return memberService.registerMember(request);
    }
}