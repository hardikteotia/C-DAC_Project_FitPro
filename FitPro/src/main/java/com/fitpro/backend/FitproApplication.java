package com.fitpro.backend; // ⚠️ Confirm this matches your package name at the top of the file

import com.fitpro.backend.entity.AppUser;
import com.fitpro.backend.repository.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.List;

@SpringBootApplication
public class FitproApplication {
	public static void main(String[] args) {
		SpringApplication.run(FitproApplication.class, args);
	}
}