export const data = [
  {
    iterationData: {
      iteration: 2,
      user: 'AxosOLB-UAT-QA',
      account: '',
      visibility: '',
      expected: '',
      queryParamstr: '',
      accountsub: 201,
      branch: '',
      rep: '',
    },
    failedReason: 'No token',
  },
  {
    iterationData: {
      iteration: 3,
      user: 'AxosOLB-UAT-QA',
      account: 11591962,
      visibility: 0,
      expected: 'Not Authorized',
      queryParamstr: '&asSubNo=80',
      accountsub: 201,
      branch: '',
      rep: '',
    },
    failedReason: 'No token',
  },
  {
    iterationData: {
      iteration: 5,
      user: 'AxosClearingSuper-AUT',
      account: 11591962,
      visibility: 1,
      expected: '',
      queryParamstr: '&asSubNo=80',
      accountsub: 201,
      branch: '',
      rep: '',
    },
    failedReason: 'Visibility is incorrect, verifyAccountResponse is false',
  },
];
