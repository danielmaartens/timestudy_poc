const Boom = require('boom');

const Account = require('../models/Account');

exports.checkOwnership = (requestedAccountId, req) => {

	// use prmoises for chaining with other objection stuff...
	return new Promise((resolve, reject) => {

		if (req.auth.strategy === 'apikey' && req.auth.isAuthenticated) {
			return resolve(true);
		}

		const currentAccountId = req.auth.isAuthenticated ? req.auth.credentials.accountId : null;

		if (!currentAccountId || (currentAccountId !== requestedAccountId)) {
			return reject(Boom.forbidden());
		}

		return resolve(true);
	});
};

exports.checkIsAdmin = (req) => {
	// use prmoises for chaining with other objection stuff...
	return new Promise((resolve, reject) => {

		const currentAccountId = req.auth.isAuthenticated ? req.auth.credentials.accountId : null;

		if (!currentAccountId) {
			return reject(Boom.forbidden());
		}

		return Account
			.query()
			.findById(currentAccountId)
			.eager('[accountRoles]')
			.then(account => {

				if (!account) {
					return reject(Boom.forbidden());
				}

				const accountRoleMachinesNames = account.accountRoles.map(role => role.machineName);
				const isAdmin = (accountRoleMachinesNames.includes('super-administrator') || accountRoleMachinesNames.includes('training-administrator'));

				return isAdmin ? resolve(true) : reject(Boom.forbidden());
			});
	});
};
