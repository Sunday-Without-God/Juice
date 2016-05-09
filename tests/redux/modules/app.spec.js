import reducer, * as app from 'redux/modules/app';
import mockStore from '../../helpers/mock-store';
import { clearExam } from 'redux/modules/exam';
import { clearQuestion } from 'redux/modules/question';
import { clearSubmissions } from 'redux/modules/submission';
import { clearUsers } from 'redux/modules/users';

describe('(Redux) app', () => {
  describe('(Action Creators) #setStatus', () => {
    it('Create action to set status', () => {
      expect(app.setStatus('foo')).to.deep.equal({
        type: app.SET_STATUS,
        payload: 'foo'
      });
    });
  });

  describe('(Action Creators) #clearStatus', () => {
    it('Create action to clear status', () => {
      expect(app.clearStatus()).to.deep.equal({
        type: app.CLEAR_STATUS,
        payload: undefined
      });
    });
  });

  describe('(Action Creators) #setError', () => {
    it('Create action to set error', () => {
      expect(app.setError('foo')).to.deep.equal({
        type: app.SET_ERROR,
        payload: 'foo'
      });
    });
  });

  describe('(Action Creators) #clearError', () => {
    it('Create action to clear error', () => {
      expect(app.clearError()).to.deep.equal({
        type: app.CLEAR_ERROR,
        payload: undefined
      });
    });
  });

  describe('(Async Actions) #clearCache', () => {
    it('Clear all cache', () => {
      const store = mockStore({});

      store.dispatch(app.clearCache());

      expect(store.getActions()).to.deep.include.members([
        clearExam(),
        clearQuestion(),
        clearUsers(),
        clearSubmissions()
      ]);
    });
  });

  describe('(Reducer)', () => {
    it('Configure initial state correct', () => {
      expect(reducer(undefined, {})).to.equal(app.initialState);
    });

    it('Handle setState action', () => {
      const expectedState = app.AppStatus({
        status: 'foo'
      });

      expect(reducer(app.initialState, {
        type: app.SET_STATUS,
        payload: 'foo'
      })).to.equal(expectedState);
    });

    it('Handle clearState action', () => {
      const initialState = app.AppStatus({
        status: 'foo'
      });
      const expectedState = app.AppStatus({
        status: 'NONE'
      });

      expect(reducer(initialState, {
        type: app.CLEAR_STATUS
      })).to.equal(expectedState);
    });
  });
});
