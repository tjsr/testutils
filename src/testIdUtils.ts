import { IdNamespace, SessionSecret, UserId } from './types.js';

import { NIL_UUID, SESSION_SECRET_UUID, createTestRunNamespace } from './testNamespaceUtils.js';
import { TaskContext } from 'vitest';
import crypto from 'crypto';
import { v5 } from 'uuid';

const CURRENT_TEST_RUN_ID = Math.floor(Math.random() * 1000);

/*
 * @deprecated
 */
export const generateSuiteId = (suiteId: string, suiteRange = 1000): number => {
  const hash = crypto.createHash('md5').update(suiteId).digest('hex');
  const number = parseInt(hash.substring(0, 15), 16) % suiteRange;
  return number;
};

/*
 * @deprecated
 */
export const generateTestIdNumber = (suiteId: string, suiteRange = 1000, range = 1000000): number => {
  const testIdNumber = generateSuiteId(suiteId) * suiteRange + CURRENT_TEST_RUN_ID + range;
  return testIdNumber;
};

/*
 * @deprecated
 */
export const generateTestIdString = (suiteId: string, prefix = 'id', range = 1000): string => {
  const testIdNumber = generateTestIdNumber(suiteId, range);
  return `${prefix}${testIdNumber.toString().padStart(7, '0')}`;
};

/*
 * @deprecated
 */
export const createTestUserId = (suite: string): string => {
  return generateTestIdString(suite, 'u', 1000);
};

/*
 * @deprecated
 */
export const createTestObjectId = (suite: string): string => {
  return generateTestIdString(suite, 'o', 1000);
};

/*
 * @deprecated
 */
export const createTestSessionId = (suite: string): string => {
  return generateTestIdString(suite, 'o', 1000);
};

const generatePrefixedUuidForTest = (
  context: TaskContext, namespace: IdNamespace = NIL_UUID, prefix?: string
): IdNamespace => {
  const taskNamespace: IdNamespace = createTestRunNamespace(context.task.name, namespace);

  const uuidForTask: IdNamespace = v5((prefix ? prefix + '-' : '') + context.task.name, taskNamespace);
  return uuidForTask;
};

export const generateSessionIdForTest = (context: TaskContext, sessionPrefix?: string): string => {
  return generatePrefixedUuidForTest(context, NIL_UUID, sessionPrefix);
};

export const generateUserIdForTest = (context: TaskContext, userPrefix?: string): UserId => {
  return generatePrefixedUuidForTest(context, NIL_UUID, userPrefix);
};

export const generateSessionSecretForTest = (
  context: TaskContext,
  sessionPrefix?: string
): SessionSecret => generatePrefixedUuidForTest(
  context,
  sessionPrefix,
  SESSION_SECRET_UUID
);
