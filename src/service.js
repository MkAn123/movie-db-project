export const access_token = `eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwODZjOTEwMjAyNjUyZGUyMTUzNGFkMGZkYzc3ZjU3NiIsInN1YiI6IjY0NzZhZmRlMjU1ZGJhMDE0YTA3ODgwZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.RZCkvtZxWtiJ-Xf5LL_uXpE-zwxWhoAXpGTH8XPlZyo`;
export const api_key = `086c910202652de21534ad0fdc77f576`;

const requestToken = async () => {
	return fetch(`https://api.themoviedb.org/3/authentication/token/new`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`,
		},
	}).then((res) => res.json());
};

const requestLogin = async (username, password, request_token) => {
	return fetch(
		`https://api.themoviedb.org/3/authentication/token/validate_with_login?api_key=${api_key}`,
		{
			method: 'POST',
			body: JSON.stringify({
				username,
				password,
				request_token,
			}),
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
		}
	).then((res) => res.json());
};

const createSession = async (request_token) => {
	return fetch(
		`https://api.themoviedb.org/3/authentication/session/new?api_key=${request_token}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
			body: JSON.stringify({
				request_token,
			}),
		}
	).then((res) => res.json());
};

const getAccount = async (session_id) => {
	return fetch(
		`https://api.themoviedb.org/3/account?api_key=${api_key}&session_id=${session_id}`,
		{
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${access_token}`,
			},
		}
	).then((res) => res.json());
};

export const login = async (username, password) => {
	try {
		let data, request_token, session_id, userdata;
		data = await requestToken();
		request_token = data.request_token;

		data = await requestLogin(username, password, request_token);
		request_token = data.request_token;

		data = await createSession(request_token);
		session_id = data.session_id;

		userdata = await getAccount(session_id);

		return {
			session_id,
			userdata,
		};
	} catch (err) {
		console.log(err);
		return null;
	}
};
