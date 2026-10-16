import re

from rest_framework import serializers

from .models import Client


class ClientSerializer(serializers.ModelSerializer):
    nom_complet = serializers.CharField(read_only=True)

    class Meta:
        model = Client
        fields = [
            "id", "nom", "prenom", "nom_complet", "email", "telephone",
            "numero_permis", "adresse", "created_at",
        ]
        read_only_fields = ["id", "created_at"]
        extra_kwargs = {
            "email": {"error_messages": {"unique": "Un client avec cet email existe déjà."}},
            "telephone": {"error_messages": {"unique": "Un client avec ce téléphone existe déjà."}},
            "numero_permis": {
                "error_messages": {"unique": "Ce numéro de permis est déjà enregistré."}
            },
        }

    def to_internal_value(self, data):
        data = data.copy()
        if isinstance(data.get("telephone"), str):
            data["telephone"] = re.sub(r"[\s.\-()]", "", data["telephone"])
        if isinstance(data.get("email"), str):
            data["email"] = data["email"].strip().lower()
        for name in ("nom", "prenom", "numero_permis"):
            if isinstance(data.get(name), str):
                data[name] = re.sub(r"\s+", " ", data[name]).strip()
        return super().to_internal_value(data)
