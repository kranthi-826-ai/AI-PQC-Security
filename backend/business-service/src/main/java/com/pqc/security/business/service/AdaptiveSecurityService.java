package com.pqc.security.business.service;

import com.pqc.security.business.client.AdaptivePolicyClient;
import com.pqc.security.business.dto.AdaptiveSecureRequest;
import com.pqc.security.business.dto.AdaptiveSecureResponse;
import com.pqc.security.business.dto.PolicyDecision;
import com.pqc.security.business.entity.CryptoExecutionEntity;
import com.pqc.security.business.repository.CryptoExecutionRepository;
import com.pqc.security.crypto.api.CryptoKeyPair;
import com.pqc.security.crypto.api.SecureEnvelope;
import com.pqc.security.crypto.hybrid.CryptoProfile;
import com.pqc.security.crypto.hybrid.CryptoProfileFactory;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.GeneralSecurityException;
import java.security.MessageDigest;
import java.util.Arrays;
import java.util.Base64;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class AdaptiveSecurityService {

    private final AdaptivePolicyClient policyClient;
    private final CryptoExecutionRepository executionRepository;

    public AdaptiveSecurityService(AdaptivePolicyClient policyClient,
                                   CryptoExecutionRepository executionRepository) {
        this.policyClient = policyClient;
        this.executionRepository = executionRepository;
    }

    public AdaptiveSecureResponse protect(AdaptiveSecureRequest request, String username,
                                          String suppliedCorrelationId) throws GeneralSecurityException {
        long started = System.nanoTime();
        String correlationId = hasText(suppliedCorrelationId) ? suppliedCorrelationId : UUID.randomUUID().toString();
        String executionId = UUID.randomUUID().toString();
        byte[] plaintext = request.data().getBytes(StandardCharsets.UTF_8);
        CryptoExecutionEntity audit = new CryptoExecutionEntity(executionId, java.time.Instant.now(),
                correlationId, username, sha256(plaintext));
        executionRepository.save(audit);

        try {
            long policyStarted = System.nanoTime();
            PolicyDecision decision = policyClient.evaluate(request, correlationId);
            long policyMillis = elapsedMillis(policyStarted);

            long cryptoStarted = System.nanoTime();
            CryptoProfile profile = CryptoProfileFactory.create(decision.algorithmProfile());
            CryptoKeyPair recipient = profile.kem().generateKeyPair();
            CryptoKeyPair signer = profile.signatures().generateKeyPair();
            byte[] aad = (executionId + ":" + correlationId + ":" + decision.decisionId())
                    .getBytes(StandardCharsets.UTF_8);
            SecureEnvelope envelope = profile.envelopeService().seal(
                    recipient.publicKey(), signer.privateKey(), plaintext, aad);
            byte[] verifiedPlaintext = profile.envelopeService().open(
                    recipient.privateKey(), signer.publicKey(), envelope, aad);
            boolean verified = MessageDigest.isEqual(plaintext, verifiedPlaintext);
            Arrays.fill(verifiedPlaintext, (byte) 0);
            long cryptoMillis = elapsedMillis(cryptoStarted);
            long totalMillis = elapsedMillis(started);

            audit.complete(decision.decisionId(), decision.effectiveRiskLevel(), decision.riskScore(),
                    decision.selectedMode(), decision.algorithmProfile(), decision.policyVersion(),
                    decision.modelVersion(), policyMillis, cryptoMillis, totalMillis, verified);
            executionRepository.save(audit);
            if (!verified) {
                throw new GeneralSecurityException("Cryptographic round-trip verification failed");
            }

            Base64.Encoder encoder = Base64.getEncoder();
            return new AdaptiveSecureResponse(executionId, decision.decisionId(), correlationId,
                    decision.effectiveRiskLevel(), decision.riskScore(), decision.selectedMode(),
                    decision.algorithmProfile(), decision.policyVersion(), decision.modelVersion(),
                    encoder.encodeToString(envelope.payload().ciphertext()),
                    encoder.encodeToString(envelope.payload().nonce()),
                    encoder.encodeToString(envelope.encapsulation()),
                    encoder.encodeToString(envelope.signature()), true,
                    policyMillis, cryptoMillis, totalMillis);
        } catch (GeneralSecurityException | RuntimeException exception) {
            audit.fail(elapsedMillis(started), exception.getMessage());
            executionRepository.save(audit);
            throw exception;
        } finally {
            Arrays.fill(plaintext, (byte) 0);
        }
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private static long elapsedMillis(long startNanos) {
        return (System.nanoTime() - startNanos) / 1_000_000;
    }

    private static String sha256(byte[] value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value));
        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException("SHA-256 is unavailable", exception);
        }
    }
}
