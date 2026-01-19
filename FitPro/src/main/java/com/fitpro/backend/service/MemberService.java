package com.fitpro.backend.service;

import com.fitpro.backend.dto.MemberRegistrationRequest;
import com.fitpro.backend.entity.*;
import com.fitpro.backend.repository.AppUserRepository;
import com.fitpro.backend.repository.MemberRepository;
import com.fitpro.backend.repository.MembershipPlanRepository;
import com.fitpro.backend.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

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

    @Transactional //if something goes wrong rollback
    public Member registerMember(MemberRegistrationRequest request) {

        //first we will create the login Account ()
        AppUser user = new AppUser();
        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(Role.MEMBER);

        user = userRepo.save(user);

        //now we will fetch the plans
        MembershipPlan plan = planRepo.findById(request.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        //now we creating here Member profile
        Member member = new Member();
        member.setName(request.getName());
        member.setPhone(request.getPhone());
        member.setAddress(request.getAddress());
        member.setUser(user); //linking the login
        member.setMembershipPlan(plan);//linking the plan

        //managing dates here
        member.setStartDate(LocalDate.now());
        member.setEndDate(LocalDate.now().plusDays(plan.getDurationInDays()));

        //linking trainer
        if (request.getTrainerId() != null) {
            Trainer trainer = trainerRepo.findById(request.getTrainerId())
                    .orElseThrow(() -> new RuntimeException("Trainer not found"));
            member.setTrainer(trainer);
        }
        return memberRepo.save(member);
    }
}