package com.fitpro.backend.service;

import com.fitpro.backend.dto.MemberRegistrationRequest;
import com.fitpro.backend.entity.*;
import com.fitpro.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@Service
public class MemberService {

    @Autowired
    private AppUserRepository userRepo;

    @Autowired
    private MemberRepository memberRepo;

    @Autowired
    private MembershipPlanRepository planRepo;

    @Autowired
    private TrainerRepository trainerRepo;

    @Transactional
    public Member registerMember(MemberRegistrationRequest request) {
        // 1. Prevent Duplicate Emails
        if (userRepo.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }

        // 2. Create Login Account
        AppUser user = new AppUser();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(Role.MEMBER);

        user = userRepo.save(user);

        // 3. Fetch Plan
        MembershipPlan plan = planRepo.findById(request.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        // 4. Create Member Profile
        Member member = new Member();
        member.setName(request.getName());
        member.setPhone(request.getPhone());
        member.setAddress(request.getAddress());
        member.setUser(user);
        member.setMembershipPlan(plan);
        // Default active = true is set in Entity, but good to know

        // 5. Link Trainer
        if (request.getTrainerId() != null) {
            Trainer trainer = trainerRepo.findById(request.getTrainerId())
                    .orElseThrow(() -> new RuntimeException("Trainer not found"));
            member.setTrainer(trainer);
        }

        return memberRepo.save(member);
    }

    // 1. READ ALL (Active Only) - 👇 UPDATED
    public List<Member> getAllMembers() {
        return memberRepo.findByActiveTrue();
    }

    // 2. READ ONE
    public Member getMemberById(Long id) {
        return memberRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with ID: " + id));
    }

    // 3. SOFT DELETE (Mark as Inactive) - 👇 UPDATED
    @Transactional
    public void deleteMember(Long id) {
        Member member = memberRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found with ID: " + id));

        // We DO NOT delete payments or attendance anymore. We keep the history!

        // Just flip the switch
        member.setActive(false);

        memberRepo.save(member);
    }

    // 4. UPDATE (PUT - Admin updates Member)
    public Member updateMember(Long id, Member memberDetails) {
        Member member = getMemberById(id);

        member.setName(memberDetails.getName());
        member.setPhone(memberDetails.getPhone());
        member.setAddress(memberDetails.getAddress());

        // Handle Email Update for Admin
        if (memberDetails.getUser() != null && memberDetails.getUser().getEmail() != null) {
            member.getUser().setEmail(memberDetails.getUser().getEmail());
            userRepo.save(member.getUser());
        }

        return memberRepo.save(member);
    }

    // 5. PATCH (Partial Update)
    public Member patchMember(Long id, Map<String, Object> updates) {
        Member member = getMemberById(id);
        updates.forEach((key, value) -> {
            switch (key) {
                case "phone": member.setPhone((String) value); break;
                case "address": member.setAddress((String) value); break;
                case "name": member.setName((String) value); break;
                case "email":
                    if(member.getUser() != null) {
                        member.getUser().setEmail((String) value);
                        userRepo.save(member.getUser());
                    }
                    break;
            }
        });
        return memberRepo.save(member);
    }
}