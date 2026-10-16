import re

from rest_framework import serializers

from .models import Voiture


class VoitureSerializer(serializers.ModelSerializer):
    statut_label = serializers.CharField(source="get_statut_display", read_only=True)

    class Meta:
        model = Voiture
        fields = [
            "id", "marque", "modele", "immatriculation", "annee", "couleur",
            "prix_jour", "statut", "statut_label", "created_at",
        ]
        read_only_fields = ["id", "created_at"]
        extra_kwargs = {
            "immatriculation": {
                "error_messages": {"unique": "Cette immatriculation existe déjà."}
            },
        }

    def to_internal_value(self, data):
        data = data.copy()
        if isinstance(data.get("immatriculation"), str):
            data["immatriculation"] = re.sub(r"\s+", " ", data["immatriculation"]).strip().upper()
        return super().to_internal_value(data)
