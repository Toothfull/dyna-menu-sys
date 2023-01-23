//@deno-types="npm:@types/express"
import express, { request, response } from 'npm:express';

const app = express();
const port = 9000 
const clientID = '604742774438-n3saa7d0qp5qi5m5cau1ugd3ee6ih942.apps.googleusercontent.com'
const clientSecret = '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'


app.use(express.static('./Browser/'));

app.get("/oauthlink", (_, response) => {
	//console.log('got')
	const state = randomString(16);
	response.send(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=http://localhost:9000/authorisedoauth&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&access_type=online&state=${state}&prompt=consent&include_granted_scopes=true`)
}) 

app.get("/authorisedoauth", async (request, response) => { 
	const authCode = request.query.code?.toString();
	const scope = request.query.scope?.toString();
	const state = request.query.state?.toString();
	const authUser = request.query.authuser?.toString();
	const prompt = request.query.prompt?.toString();

	if (authCode == null || scope == null || state == null || authUser == null || prompt == null) {
		response.send('Error')
	} else {
		//console.log(authCode, scope, state, authUser, prompt)

		const googleData = new URLSearchParams({
			'code': authCode,
			'client_id': clientID,
			'client_secret': clientSecret,
			'redirect_uri': 'http://localhost:9000/authorisedoauth',
			'grant_type': 'authorization_code'
		});
	
		const googleResponse = await fetch('https://oauth2.googleapis.com/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: googleData.toString()
		})

		const googleResponseData = await googleResponse.json();
		//console.dir(googleResponseData)

		const accessToken = googleResponseData.access_token;
		const tokenType = googleResponseData.token_type;
		const expiresIn = googleResponseData.expires_in;
		const scopeNew = googleResponseData.scope;
		const idToken = googleResponseData.id_token;

		const googleUserDetails = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`, {
			method: "GET"
		} )

		const googleUserDetailsData = await googleUserDetails.json();

		const email = googleUserDetailsData.email;
		const id = googleUserDetailsData.id;
		const name = googleUserDetailsData.name;
		const picture = googleUserDetailsData.picture;

		console.log(email, id, name, picture)
		
	
		response.send('Authorised')
	}


});


app.listen(port, () => {
  	console.log('Example app listening on port ' + port);
});


//Create a function which creates a random 16 character string
function randomString(length: number) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}
