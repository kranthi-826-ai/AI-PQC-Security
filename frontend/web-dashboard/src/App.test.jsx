import React from 'react';
import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {App} from './main.jsx';

const response = (body, status = 200) => Promise.resolve({
  ok: status >= 200 && status < 300,
  status,
  json: () => Promise.resolve(body)
});

describe('AI-PQC dashboard', () => {
  beforeEach(() => vi.stubGlobal('fetch', vi.fn()));
  afterEach(() => vi.unstubAllGlobals());

  it('logs in, stores the token for the session, and renders research metrics', async () => {
    fetch
      .mockReturnValueOnce(response({token: 'signed.jwt.value'}))
      .mockReturnValueOnce(response([{eventId:'e1',eventType:'LOGIN_SUCCEEDED',outcome:'SUCCESS',sourceService:'auth-service',username:'researcher',requestPath:'/login',occurredAt:'2026-09-29T10:00:00Z'}]))
      .mockReturnValueOnce(response([{executionId:'x1',riskLevel:'HIGH',riskScore:0.91,selectedMode:'PQC',algorithmProfile:'ML-KEM-768+AES-256-GCM+ML-DSA-65',policyLatencyMillis:40,cryptoLatencyMillis:20,totalLatencyMillis:70,roundTripVerified:true,outcome:'SUCCESS'}]));

    const user = userEvent.setup();
    render(<App/>);
    await user.clear(screen.getByLabelText('Username'));
    await user.type(screen.getByLabelText('Username'), 'researcher');
    await user.type(screen.getByLabelText('Password'), 'safe-password');
    await user.click(screen.getByRole('button', {name:'Sign in securely'}));

    expect(await screen.findByText('Adaptive protection overview')).toBeInTheDocument();
    expect(screen.getByText('91%')).toBeInTheDocument();
    expect(screen.getAllByText('ML-KEM-768+AES-256-GCM+ML-DSA-65')).toHaveLength(2);
    expect(sessionStorage.getItem('pqcToken')).toBe('signed.jwt.value');
  });

  it('removes an expired token and returns to login after an unauthorized response', async () => {
    sessionStorage.setItem('pqcToken', 'expired.jwt.value');
    fetch.mockReturnValue(response({message:'Token expired'}, 401));
    render(<App/>);

    await waitFor(() => expect(screen.getByRole('button', {name:'Sign in securely'})).toBeInTheDocument());
    expect(sessionStorage.getItem('pqcToken')).toBeNull();
  });
});
