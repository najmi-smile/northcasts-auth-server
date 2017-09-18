/* eslint-disable no-console */
const mongoose = require('mongoose');
const User = require('../models/user');
const gh = require('../services/githubApi');

require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_URI);

mongoose.connection.collections['users'].drop((err) => {
  if (err) console.info('⚠️ Collection users was already empty!');
  else console.info('✅ Dropped collection users');
  gh.users.getTeams({org: 'northcoders'})
    .then(({ data }) => filterCohorts(data))
    .then(promiseToGetMembersByCohort)
    .then(flatMapToUserDocs)
    .then(User.insertMany)
    .then(savedUsers => console.log(`✅ Saved ${savedUsers.length} users.`))
    .catch(console.error)
    .then(() => mongoose.disconnect());
});

function filterCohorts (teams) {
  const regexp_cohortTeam = /\d\d\d-\w+/;
  return teams.filter(t => regexp_cohortTeam.test(t.name));
}

function promiseToGetMembersByCohort (cohorts) {
  const cohortPromises = cohorts.map(({id}) => (
    gh.orgs.getTeamMembers({ id, role: 'member' })
  ));
  return Promise.all([cohorts, ...cohortPromises]);
}

function flatMapToUserDocs ([cohorts, ...membersByCohort]) {
  return membersByCohort.reduce((acc, {data: members}, i) => {
    const cohort = cohorts[i];
    const cohortUserDocs = members.map(m => {
      return new User({
        username: m.login,
        cohort: cohort.name,
        avatar_url: m.avatar_url,
        gh_team_id: cohort.id
      });
    });
    return [...acc, ...cohortUserDocs];
  }, []);
}
