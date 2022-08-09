import { expect } from 'chai';
import nock, { back } from 'nock';

import Adaptor from '../lib';
const { execute } = Adaptor;

describe('lookupUser', () => {
  it('should look up user', async () => {
    nock('https://api.twitter.com')
      .get('2/users/by/userName')
      .reply(200, {
        data: {
          id: 'b',
          name: 'bob'
        },
      })

    const state = await execute(
      lookupUser('bob')
    );

    expect(state.users.bob).eql('b');
  });
});