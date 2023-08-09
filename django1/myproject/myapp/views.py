from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from myapp.models import User
from django.contrib.auth import authenticate, login
import requests



class GoogleLoginView(APIView):
    def post(self, request):
        credential = request.data.get('credential')
        
        google_response = requests.get(f'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={credential}')
        if google_response.status_code == 200:
            google_data = google_response.json()
            email = google_data.get('email')
            name = google_data.get('name')
            photo_url = google_data.get('picture') 
            
            try:
                user = User.objects.get(email=email)
                user.google_credential = credential  # Update existing user with new Google credentials
                user.save()
                user = authenticate(request, google_credential=credential)
                login(request, user)
                print(request.user)
            except User.DoesNotExist:
                user = User.objects.create(email=email, google_credential=credential, name=name, photo_url=photo_url)
                user = authenticate(request, google_credential=credential)
                login(request, user)
                print(request.user)
            
            user_data = {
                'email': user.email,
                'name': user.name,
                'photo_url': user.photo_url,
            }
            print(user_data)
            
            return Response({'success': True, 'user': user_data})
        
        return Response({'success': False}, status=status.HTTP_401_UNAUTHORIZED)


# class GoogleLoginView(APIView):
#     def post(self, request):
#         credential = request.data.get('credential')
        
#         google_response = requests.get(f'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={credential}')
#         if google_response.status_code == 200:
#             google_data = google_response.json()
#             email = google_data.get('email')
            
            
#             user = authenticate(request, username=email, google_credential=credential)
            
#             if user:
#                 login(request, user)  # Log in the user
                
#                 return Response({'success': True, 'user_id': user.id, 'email': user.email})
#             else:
#                 return Response({'success': False, 'message': 'Authentication failed'}, status=status.HTTP_401_UNAUTHORIZED)
#         else:
#             return Response({'success': False}, status=status.HTTP_401_UNAUTHORIZED)


# class GoogleLoginView(APIView):
#     def post(self, request):
#         credential = request.data.get('credential')
        
       
#         google_response = requests.get(f'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token={credential}')
#         if google_response.status_code == 200:
#             google_data = google_response.json()
#             email = google_data.get('email')
#             name = google_data.get('name')
#             photo_url = google_data.get('picture') 

#             print("welcome")
            
#             user = User.objects.get(email=email)
#             user = authenticate(request, google_credential=credential)
                
#             if user:
#                 login(request, user)
#                 print(request.user)
#                 print(user)
                
#             else:
#                 user = User.objects.create(email=email, google_credential=credential, name=name, photo_url=photo_url)
#                 user = authenticate(request, google_credential=credential)
#                 login(request, user)
#                 print(request.user)

#                 print(user)
             
            
#             return Response({'success': True,'user': user})
#         return Response({'success': False}, status=status.HTTP_401_UNAUTHORIZED)

