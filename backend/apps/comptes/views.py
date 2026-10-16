from django.contrib.auth import authenticate
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RegisterSerializer, infos_utilisateur


def reponse_session(user, code=status.HTTP_200_OK):
    token, _ = Token.objects.get_or_create(user=user)
    return Response({"token": token.key, "user": infos_utilisateur(user)}, status=code)


class LoginView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        identifiant = str(request.data.get("username", "")).strip()
        mot_de_passe = request.data.get("password", "")
        user = None
        for candidat in (identifiant, identifiant.lower()):
            user = authenticate(request, username=candidat, password=mot_de_passe)
            if user:
                break
        if user is None:
            return Response(
                {"detail": "Identifiant ou mot de passe incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return reponse_session(user)


class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return reponse_session(user, status.HTTP_201_CREATED)


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(infos_utilisateur(request.user))
