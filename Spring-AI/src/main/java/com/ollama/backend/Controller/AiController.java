package com.ollama.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ollama.backend.Service.AIService;

import reactor.core.publisher.Flux;

@RestController
public class AiController {

	@Autowired
	AIService aiService;
	
	
	public AiController(AIService aiService) {
		this.aiService=aiService;
	}

	
	@GetMapping("/ai")
	public Flux<String> askAi(@RequestParam(required=false,defaultValue="Greet me") String query){
		return aiService.askAi(query);
	}
	
	
	

	
	
	

}
