package com.habittracker.security;

import com.habittracker.models.User;
import com.habittracker.repositories.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final UserDetailsServiceImpl userDetailsService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        
        OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
        OAuth2User oAuth2User = token.getPrincipal();
        
        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        
        if (email == null) {
            // some providers might not return email
            email = "oauth2-" + UUID.randomUUID() + "@example.com";
        }
        if (name == null) {
            name = email.split("@")[0];
        }

        // Check if user exists by email, if not create dummy user record
        User user = userRepository.findByEmail(email).orElse(null);
        
        if (user == null) {
            // Generate a unique dummy username
            String dummyUsername = name.replaceAll("\\s+", "").toLowerCase() + "_" + UUID.randomUUID().toString().substring(0, 5);
            
            user = User.builder()
                .email(email)
                .username(dummyUsername)
                .password(UUID.randomUUID().toString()) // random secure password
                .build();
            userRepository.save(user);
        }

        // Generate JWT token
        org.springframework.security.core.userdetails.UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
        String jwtToken = jwtUtil.generateToken(userDetails);

        // Redirect to Frontend with token
        String frontendRedirectUrl = "http://localhost:5173/oauth-callback?token=" + jwtToken;
        getRedirectStrategy().sendRedirect(request, response, frontendRedirectUrl);
    }
}
