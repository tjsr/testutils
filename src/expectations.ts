import { CookieOptions, Response } from 'express';

import { SessionId } from "./types.js";
import { getSupertestSessionIdCookie } from './cookieTestUtils.js';
import supertest from "supertest";

export const expectSetCookieHeaderOnResponseMock = (
  cookieIdKey: string,
  response: Response,
  cookieValue: string
) => {
  expect(response.set).toBeCalledWith('Set-Cookie', `${cookieIdKey}=${cookieValue}; Path=/; HttpOnly; SameSite=Strict`);
};

export const expectSetCookieOnResponseMock = (
  cookieIdKey: string, response: Response, cookieValue: string, expectedCookieOptions?: CookieOptions) => {
  const cookieOptions: CookieOptions = {
    ...{ httpOnly: true, path: '/', sameSite: 'strict' },
    ...expectedCookieOptions,
  };
  expect(response.cookie).toBeCalledWith(cookieIdKey, cookieValue, cookieOptions);
};

export const expectResponseSetsSessionIdCookie = (
  response: supertest.Response, sessionIdKey: string, expectedSessionId: SessionId|undefined, secret: string
): void => {
  const cookieValue = getSupertestSessionIdCookie(sessionIdKey, response, secret);
  if (expectedSessionId !== undefined) {
    expect(cookieValue).toMatch(expectedSessionId);
  }
};

export const expectDifferentSetCookieSessionId = (sessionId: SessionId, cookieValue: string): void => {
  expect(cookieValue, `sessionID ${sessionId} in Set-Cookie should have been updated`)
    .not.toMatch(new RegExp(`sessionId=${sessionId}`));
  expect(cookieValue).toMatch(new RegExp(`sessionId=(?!${sessionId}).*; Path=/; HttpOnly; SameSite=Strict`));
};

export const expectSetCookieSessionId = (sessionId: SessionId, cookieValue: string): void => {
  expect(cookieValue).toEqual(`sessionId=${sessionId}; Path=/; HttpOnly; SameSite=Strict`);
};

export const expectResponseResetsSessionIdCookie = (
  response: supertest.Response, originalSessionId: SessionId, checkMultiple = false
) => {
  const responseCookies = response.get('Set-Cookie');
  expect(responseCookies, 'Expected Set-Cookie response header to be sent but was not').not.toBeUndefined();
  expect(responseCookies!.length, 'Response Set-Cookie header had no values').toBeGreaterThan(0);

  const matchingCookieValue: string|undefined =
    responseCookies?.find((cookieValue:string) => cookieValue.match(/sessionId=(.*);/));

  expect(matchingCookieValue, 'Response Set-Cookie header had no value with sessionId=').not.toBeUndefined();
  expectDifferentSetCookieSessionId(originalSessionId, matchingCookieValue!);

  if (checkMultiple) {
    expect(responseCookies!.length, 'Response had multiple Set-Cookie header values:' + responseCookies).toEqual(1);
    const firstCookieValue = responseCookies![0]!;
    expectDifferentSetCookieSessionId(originalSessionId, firstCookieValue);
  }
};

export const expectSessionCookieHeaderOnResponseMock = (response: Response, sessionID: string) => {
  expect(response.cookie).toBeCalledWith('sessionId', sessionID, { httpOnly: true, path: '/', strict: true });
};
