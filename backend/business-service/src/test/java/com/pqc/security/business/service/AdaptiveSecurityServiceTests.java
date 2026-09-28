package com.pqc.security.business.service;

import com.pqc.security.business.client.AdaptivePolicyClient;
import com.pqc.security.business.dto.AdaptiveSecureRequest;
import com.pqc.security.business.dto.PolicyDecision;
import com.pqc.security.business.repository.CryptoExecutionRepository;
import org.junit.jupiter.api.Test;

import java.util.Map;

import static com.pqc.security.crypto.api.CryptoProfiles.HYBRID;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class AdaptiveSecurityServiceTests {

    @Test
    void appliesPolicyProfileAndVerifiesEncryptedRoundTrip() throws Exception {
        AdaptivePolicyClient policyClient = mock(AdaptivePolicyClient.class);
        CryptoExecutionRepository repository = mock(CryptoExecutionRepository.class);
        when(policyClient.evaluate(any(), anyString())).thenReturn(new PolicyDecision(
                "decision-1", "HIGH", "HIGH", 0.91, "test risk",
                "HYBRID", HYBRID, "test selection", "1.1.0", "model-1", "correlation-1"));

        AdaptiveSecurityService service = new AdaptiveSecurityService(policyClient, repository);
        AdaptiveSecureRequest request = new AdaptiveSecureRequest(
                "classified payload", Map.of("dur", 0.1), "CONFIDENTIAL", true, true, 100);

        var response = service.protect(request, "researcher", "correlation-1");

        assertThat(response.algorithmProfile()).isEqualTo(HYBRID);
        assertThat(response.roundTripVerified()).isTrue();
        assertThat(response.encryptedPayload()).isNotBlank();
        assertThat(response.encryptedPayload()).doesNotContain("classified payload");
        verify(repository, org.mockito.Mockito.times(2)).save(any());
    }
}
