package com.codebin.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;

@SpringBootApplication
public class CodebinBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CodebinBackendApplication.class, args);
	}
}

@RestController
class HelloController {
	@GetMapping("/")
	String hello() {
		return "Hello World";
	}
}
