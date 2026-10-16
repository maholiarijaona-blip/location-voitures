from django.db import IntegrityError
from django.db.models import ProtectedError
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    if isinstance(exc, ProtectedError):
        return Response(
            {"detail": "Suppression impossible : cet élément est utilisé par d'autres données."},
            status=status.HTTP_409_CONFLICT,
        )
    if isinstance(exc, IntegrityError):
        return Response(
            {"detail": "Cette valeur existe déjà ou viole une contrainte de la base de données."},
            status=status.HTTP_400_BAD_REQUEST,
        )
    return exception_handler(exc, context)
