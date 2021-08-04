package com.codebin.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
public class CodebinBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(CodebinBackendApplication.class, args);
	}
}

@RestController
class HelloController {
	@GetMapping("/hello/{name}")
	public String hello(@PathVariable("name") String name) {
		return "Hello " + name;
	}
}
