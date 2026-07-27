package com.flowos.flowos_api.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI flowOSOpenAPI() {

        final String securitySchemeName = "Bearer Authentication";

        return new OpenAPI()

                .info(new Info()

                        .title("FlowOS API")

                        .version("1.0.0")

                        .description("""
                                FlowOS is an AI-powered Financial Operating System
                                for SMEs providing authentication,
                                user management,
                                invoice financing,
                                customer management,
                                vendor management,
                                and AI financial intelligence.
                                """)

                        .contact(new Contact()

                                .name("FlowOS Development Team")

                                .email("support@flowos.com")

                                .url("https://flowos.com"))

                        .license(new License()

                                .name("Apache 2.0")

                                .url("https://www.apache.org/licenses/LICENSE-2.0"))

                )

                .addSecurityItem(
                        new SecurityRequirement()
                                .addList(securitySchemeName)
                )

                .components(new Components()
                .addSecuritySchemes(
                        securitySchemeName,
                        new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                )
        );
    }

}