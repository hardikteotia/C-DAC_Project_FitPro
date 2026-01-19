package com.fitpro.backend.dto;

import lombok.Data;

@Data
public class MemberRegistrationRequest {

    //These are for login info
    private String email;
    private String password;

    //These are for personal info
    private String name;
    private String phone;
    private String address;

    //Selections (We only need the IDs, not the whole object)
    private Long planId;    // Which plan did they pick?
    private Long trainerId; // (Optional) Which trainer did they pick?

}
