package com.fitpro.backend.repository;

import com.fitpro.backend.entity.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/*JPA (Jakarta perstistence API) Specification that defines how java objects are
mapped to the database tables using ORM

-> it provides us save(), findById(), etc automatically*/

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByEmail(String email);

}
