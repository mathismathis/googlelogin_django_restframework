from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView

class GoogleLogin(SocialLoginView): 
    adapter_class = GoogleOAuth2Adapter
    callback_url = "http://127.0.0.1:8000/google/login/callback/"
    client_class = OAuth2Client


# from django.http import HttpResponse
# from oauthlib.oauth2 import WebApplicationClient
# import requests

# def google_oauth_callback(request):
#     # Get the authorization code from the query parameters
#     code = request.GET.get('code')

#     if code:
    
#         client_id = "111384383770-av06vjnjgop0niagg3cchtqmu77asrlq.apps.googleusercontent.com"
#         client_secret = "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"
#         redirect_uri = "http://127.0.0.1:8000/google/login/callback/"
#         client = WebApplicationClient(client_id)

#         # Exchange the code for an access token
#         token_url, headers, body = client.prepare_token_request(
#             "https://oauth2.googleapis.com/token",
#             authorization_response=request.build_absolute_uri(),
#             redirect_url=redirect_uri,
#             code=code
#         )
#         token_response = requests.post(token_url, headers=headers, data=body, auth=(client_id, client_secret))

#         if token_response.status_code == 200:
#             token_data = token_response.json()
#             access_token = token_data.get('access_token')

#             return HttpResponse("Google OAuth callback handled successfully")

#     # Return a failure response if code is missing or exchange failed
#     return HttpResponse("Google OAuth callback failed")
