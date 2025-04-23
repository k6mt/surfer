package com.k6m.apisuffer;

import com.k6m.apisuffer.annotation.EnableAPISuffer;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@EnableAPISuffer
public class ApisufferApplication {

	public static void main(String[] args) {
		SpringApplication.run(ApisufferApplication.class, args);
	}

}
