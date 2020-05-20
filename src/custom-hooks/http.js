import { useReducer, useCallback } from 'react'

const initialState = {
  isLoading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
}

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND': return { isLoading: true, error: null, extra: null, identifier: action.identifier, data: null };
    case 'RESPONSE': return { ...curHttpState, isLoading: false, extra: action.extra, data: action.data };
    case 'ERROR': return { isLoading: false, error: action.errorMessage };
    case 'CLEAR': return initialState
    default:
      throw new Error('should not get there');
  }
}

function useHttp () {
  const [httpState, dispatchHttp] = useReducer(httpReducer, initialState);

  const closeError = useCallback(() => {
    dispatchHttp({ type: 'CLEAR' });
  }, [])

  const sendRequest = useCallback(async (url, httpMethod, body, extra, identifier) => {
    try {
      dispatchHttp({ type: 'SEND', identifier: identifier });

      const response = await fetch(url, {
        method: httpMethod,
        body: body,
        headers: { 'Content-Type': 'application/json' }
      });

      const responseData = await response.json();

      dispatchHttp({ type: 'RESPONSE', extra: extra, data: responseData });

    } catch (error) {
      dispatchHttp({ type: 'ERROR', errorMessage: error.message });
    }
  }, [])

  return {
    sendRequest: sendRequest,
    isLoading: httpState.isLoading,
    error: httpState.error,
    responseData: httpState.data,
    reqExtra: httpState.extra,
    reqIndentifier: httpState.identifier,
    closeError: closeError
  }
}

export default useHttp;