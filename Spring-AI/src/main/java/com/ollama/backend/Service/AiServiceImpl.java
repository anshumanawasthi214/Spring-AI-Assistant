package com.ollama.backend.Service;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import reactor.core.publisher.Flux;

	
@Service
public class AiServiceImpl implements AIService {
	
	
	
	private ChatClient client;
	
	
	public AiServiceImpl(ChatClient.Builder chatBuilder) {
		this.client=chatBuilder.build();
	}

	@Override
	public Flux<String> askAi(String question) {
		// TODO Auto-generated method stub
		Flux<String>response= client.prompt()
				.user(question)
				.stream()
				.content();
		return response;
	}

}
