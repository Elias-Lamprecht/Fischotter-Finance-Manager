export const ERRORS = {
	GENERAL: {
		MISSING_DATA: 'Missing Fields',
		ERROR: 'An unexpected error occurred. Please try again later.',
	},
	AUTH: {
		USER_NOT_FOUND: 'No User Account has been found with those crendentials',
		NOT_ACTIVE: 'Your User Account hasnt been activated',
		NOT_LOGGED_IN: 'Please login first before using the API',
		INSUFFICIENT_PERMISSIONS:
			'Your User Account is missing the needed permissions for this API',
		INVALID_CREDENTIALS: 'Invalid Credentials',
		USERNAME_TAKEN: 'Username is already taken',
	},
	UPDATE: {
		NO_CHANGES_DETECTED:
			'No changes were detected. Please modify at least one field before updating.',
	},
};
