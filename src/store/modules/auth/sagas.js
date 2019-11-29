import { takeLatest, call, put, all } from 'redux-saga/effects';
import { Alert } from 'react-native';
// import history from '~/services/history';
import api from '~/services/api';

import { singInSuccess, signFailure } from './actions';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    console.tron.log(email, password);
    const response = yield call(api.post, 'session', {
      email,
      password,
    });

    const { token, user } = response.data;

    if (user.provider) {
      Alert.alert('Erro no login', 'Usuário não pode ser prestador');
      return;
    }

    api.defaults.headers.Authorization = `Bearer ${token}`;

    yield put(singInSuccess(token, user));

    // history.push('/dashboard');
  } catch (err) {
    Alert.alert('Falha na autenticação', 'Erro no login, verifique seus dados');

    yield put(signFailure());
  }
}

export function* signUP({ payload }) {
  try {
    const { name, email, password } = payload;
    yield call(api.post, 'users', {
      name,
      email,
      password,
    });

    // history.push('/');
  } catch (err) {
    Alert.alert('Falha no cadastro', 'Erro no login, verifique seus dados');

    yield put(signFailure());
  }
}

export function setToken({ payload }) {
  if (!payload) return;

  const { token } = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_REQUEST', signUP),
]);
