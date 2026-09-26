package com.pqc.security.gateway.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Enumeration;
import java.util.LinkedHashSet;
import java.util.Set;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class CorrelationIdFilter extends OncePerRequestFilter {

    public static final String CORRELATION_ID_HEADER = "X-Correlation-ID";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {

        String incomingId = request.getHeader(CORRELATION_ID_HEADER);
        String correlationId = incomingId == null || incomingId.isBlank()
                ? UUID.randomUUID().toString()
                : incomingId;

        HttpServletRequest wrappedRequest = new CorrelationIdRequestWrapper(request, correlationId);
        response.setHeader(CORRELATION_ID_HEADER, correlationId);
        filterChain.doFilter(wrappedRequest, response);
    }

    private static final class CorrelationIdRequestWrapper extends HttpServletRequestWrapper {

        private final String correlationId;

        private CorrelationIdRequestWrapper(HttpServletRequest request, String correlationId) {
            super(request);
            this.correlationId = correlationId;
        }

        @Override
        public String getHeader(String name) {
            if (CORRELATION_ID_HEADER.equalsIgnoreCase(name)) {
                return correlationId;
            }
            return super.getHeader(name);
        }

        @Override
        public Enumeration<String> getHeaders(String name) {
            if (CORRELATION_ID_HEADER.equalsIgnoreCase(name)) {
                return Collections.enumeration(Collections.singleton(correlationId));
            }
            return super.getHeaders(name);
        }

        @Override
        public Enumeration<String> getHeaderNames() {
            Set<String> names = new LinkedHashSet<>();
            Enumeration<String> originalNames = super.getHeaderNames();
            if (originalNames != null) {
                originalNames.asIterator().forEachRemaining(names::add);
            }
            names.add(CORRELATION_ID_HEADER);
            return Collections.enumeration(names);
        }
    }
}
