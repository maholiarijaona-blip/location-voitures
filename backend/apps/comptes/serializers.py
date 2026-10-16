import re

from django.contrib.auth import get_user_model
from django.db import transaction
from rest_framework import serializers

from apps.clients.models import Client, phone_validator

User = get_user_model()


def infos_utilisateur(user):
    profil = getattr(user, "client_profile", None)
    if user.is_staff:
        nom = user.get_full_name() or user.username
        role = "admin"
    else:
        nom = profil.nom_complet if profil else user.username
        role = "client"
    return {"id": user.pk, "username": user.username, "nom_complet": nom, "role": role}


class RegisterSerializer(serializers.Serializer):
    nom = serializers.CharField(max_length=100)
    prenom = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    telephone = serializers.CharField(max_length=20, validators=[phone_validator])
    numero_permis = serializers.CharField(max_length=30)
    password = serializers.CharField(write_only=True, min_length=6)
    password2 = serializers.CharField(write_only=True)

    def to_internal_value(self, data):
        data = data.copy()
        if isinstance(data.get("telephone"), str):
            data["telephone"] = re.sub(r"[\s.\-()]", "", data["telephone"])
        if isinstance(data.get("email"), str):
            data["email"] = data["email"].strip().lower()
        for nom in ("nom", "prenom", "numero_permis"):
            if isinstance(data.get(nom), str):
                data[nom] = re.sub(r"\s+", " ", data[nom]).strip()
        return super().to_internal_value(data)

    def validate_email(self, value):
        if User.objects.filter(username__iexact=value).exists() or Client.objects.filter(
            email__iexact=value
        ).exists():
            raise serializers.ValidationError("Un compte existe déjà avec cet email.")
        return value

    def validate_telephone(self, value):
        if Client.objects.filter(telephone=value).exists():
            raise serializers.ValidationError("Ce numéro de téléphone est déjà utilisé.")
        return value

    def validate_numero_permis(self, value):
        if Client.objects.filter(numero_permis=value).exists():
            raise serializers.ValidationError("Ce numéro de permis est déjà enregistré.")
        return value

    def validate(self, attrs):
        if attrs["password"] != attrs.pop("password2"):
            raise serializers.ValidationError(
                {"password2": "Les deux mots de passe ne correspondent pas."}
            )
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        mot_de_passe = validated_data.pop("password")
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=mot_de_passe,
            first_name=validated_data["prenom"],
            last_name=validated_data["nom"],
        )
        Client.objects.create(user=user, **validated_data)
        return user
