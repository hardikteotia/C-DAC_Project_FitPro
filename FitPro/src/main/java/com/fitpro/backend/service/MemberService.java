package com.fitpro.backend.service;

import com.fitpro.backend.dto.MemberRegistrationRequest;
import com.fitpro.backend.entity.*;
import com.fitpro.backend.repository.AppUserRepository;
import com.fitpro.backend.repository.MemberRepository;
import com.fitpro.backend.repository.MembershipPlanRepository;
import com.fitpro.backend.repository.TrainerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
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

    @Transactional //if something goes wrong rollback
    public Member registerMember(MemberRegistrationRequest request) {

        //first we will create the login Account ()
        //member is a user so we're creating a new user
        AppUser user = new AppUser();

        user.setEmail(request.getEmail());
        user.setPassword(request.getPassword());
        user.setRole(Role.MEMBER);//setting the role ourselves cuz its member registration request

        user = userRepo.save(user);/*why we use save here but not persist cuz in save we can insert and update already
                                   existing data but in persist we can't update it throws exception(EntityExistException)

                                   -- and save returns the saved object where as persist returns void means nothing*/

        //now we will fetch the plans
        MembershipPlan plan = planRepo.findById(request.getPlanId())
                .orElseThrow(() -> new RuntimeException("Plan not found"));

        //now we're creating here Member profile
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

    // 1. READ ALL
    public List<Member> getAllMembers() {
        return memberRepo.findAll();
    }

    // 2. READ ONE
    public Member getMemberById(Long id) {
        return memberRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Member not found with ID: " + id));
    }

    // 3. DELETE
    public void deleteMember(Long id) {
        if (!memberRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Member not found with ID: " + id);
        }
        memberRepo.deleteById(id);
    }

    // 4. UPDATE (PUT - Replaces everything)
    public Member updateMember(Long id, Member memberDetails) {
        Member member = getMemberById(id);

        member.setName(memberDetails.getName());
        member.setPhone(memberDetails.getPhone());
        member.setAddress(memberDetails.getAddress());
        // Note: We usually don't update Plan/Trainer here, but we can

        return memberRepo.save(member);
    }

    // 5. PATCH (Partial Update - e.g., just phone number)
    public Member patchMember(Long id, Map<String, Object> updates) {
        Member member = getMemberById(id);

        updates.forEach((key, value) -> {
            switch (key) {
                case "phone":
                    member.setPhone((String) value);
                    break;
                case "address":
                    member.setAddress((String) value);
                    break;
                case "name":
                    member.setName((String) value);
                    break;
            }
        });
        return memberRepo.save(member);
    }
}