import { createIssueApi } from '@issue-tracker/utils';
import axios from 'axios';
import { getApiBaseUrl } from '../../../config/environment';

export const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const issueApi = createIssueApi(api);

export const getIssues = issueApi.getIssues;
export const getIssue = issueApi.getIssue;
export const createIssue = issueApi.createIssue;
export const updateIssue = issueApi.updateIssue;
export const deleteIssue = issueApi.deleteIssue;
