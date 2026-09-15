// =========================
//     google-callback.js
// =========================
exports.handler = async function(event){

    try{

        const code = event.queryStringParameters ? event.queryStringParameters.code : null;

        if(!code){
            return {
                statusCode: 400,
                body: "No se recibió CODE"
            };
        }

        // =========================
        // DATOS GOOGLE
        // =========================

        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const redirectUri = 'https://qslpro2.netlify.app/.netlify/functions/google-callback';

        // =========================
        // PEDIR TOKEN
        // =========================

        const params = new URLSearchParams();
        params.append('code', code);
        params.append('client_id', clientId);
        params.append('client_secret', clientSecret);
        params.append('redirect_uri', redirectUri);
        params.append('grant_type', 'authorization_code');

        const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        const tokenData = await tokenResponse.json();

        console.log("TOKEN DATA:", tokenData);

        if(!tokenData.access_token){
            return {
                statusCode: 400,
                body: "Error obteniendo token de Google: " + JSON.stringify(tokenData)
            };
        }

        // Redirecciona directamente enviando los tokens en la URL
        const redirectUrl = `https://qslpro2.netlify.app/?access_token=${tokenData.access_token}&refresh_token=${tokenData.refresh_token || ''}`;

        return {
            statusCode: 302,
            headers: {
                'Location': redirectUrl
            }
        };

    }catch(error){
        return {
            statusCode: 500,
            body: error.message
        };
    }
};
