"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const mongo_1 = require("./mongo");
const app = (0, express_1.default)();
const port = 9000;
const clientID = '604742774438-n3saa7d0qp5qi5m5cau1ugd3ee6ih942.apps.googleusercontent.com';
const clientSecret = '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';
app.use(express_1.default.static('../Browser/'));
app.use(express_1.default.json());
app.use((0, express_session_1.default)({
    name: 'id',
    secret: randomString(16),
    resave: true,
    saveUninitialized: false,
    cookie: {
        domain: 'localhost',
        path: '/',
    }
}));
app.get('/oauthlink', (_, response) => {
    //console.log('got')
    const state = randomString(16);
    response.send(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientID}&redirect_uri=http://localhost:9000/authorisedoauth&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile&access_type=online&state=${state}&prompt=consent&include_granted_scopes=true`);
});
app.get('/authorisedoauth', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const authCode = (_a = request.query.code) === null || _a === void 0 ? void 0 : _a.toString();
    const scope = (_b = request.query.scope) === null || _b === void 0 ? void 0 : _b.toString();
    const state = (_c = request.query.state) === null || _c === void 0 ? void 0 : _c.toString();
    const authUser = (_d = request.query.authuser) === null || _d === void 0 ? void 0 : _d.toString();
    const prompt = (_e = request.query.prompt) === null || _e === void 0 ? void 0 : _e.toString();
    if (authCode == null || scope == null || state == null || authUser == null || prompt == null) {
        response.send('Error');
    }
    else {
        //console.log(authCode, scope, state, authUser, prompt)
        const googleData = new URLSearchParams({
            'code': authCode,
            'client_id': clientID,
            'client_secret': clientSecret,
            'redirect_uri': 'http://localhost:9000/authorisedoauth',
            'grant_type': 'authorization_code'
        });
        const googleResponse = yield fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: googleData.toString()
        });
        const googleResponseData = yield googleResponse.json();
        //console.dir(googleResponseData)
        const accessToken = googleResponseData.access_token;
        //const tokenType = googleResponseData.token_type
        //const expiresIn = googleResponseData.expires_in
        //const scopeNew = googleResponseData.scope
        //const idToken = googleResponseData.id_token
        const googleUserDetails = yield fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`, {
            method: 'GET'
        });
        const googleUserDetailsData = yield googleUserDetails.json();
        const email = googleUserDetailsData.email.toString();
        const id = googleUserDetailsData.id.toString();
        const name = googleUserDetailsData.name.toString();
        const pictureLink = googleUserDetailsData.picture.toString();
        const newUser = yield (0, mongo_1.addUser)(email, id, name, pictureLink);
        if (!newUser) {
            console.log('failed to insert new user');
        }
        else {
            console.log(newUser);
            console.log('new user added');
        }
        //request.session.regenerate(async () => {
        console.log(request.sessionID);
        request.session.idoooo = id;
        console.log(request.session.idoooo);
        /*request.session.email = email;
        request.session.name = name;
        request.session.pictureLink = pictureLink;*/
        const isVerified = yield (0, mongo_1.verifyUser)(id);
        if (isVerified) {
            response.redirect('/index.html');
        }
        else {
            response.send('not verified');
        }
        //})
    }
}));
app.get('/session', (request, response) => {
    response.send({
        id: request.session.id,
        email: request.session.email,
        name: request.session.name,
        pictureLink: request.session.pictureLink
    });
});
app.listen(port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Example app listening on port ' + port);
    yield (0, mongo_1.initialConnection)();
}));
//Create a function which creates a random 16 character string
function randomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
