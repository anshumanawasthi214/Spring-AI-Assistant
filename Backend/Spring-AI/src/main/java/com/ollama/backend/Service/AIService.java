package com.ollama.backend.Service;

import reactor.core.publisher.Flux;

public interface AIService {

	
	
	Flux<String> askAi(String question);
}
