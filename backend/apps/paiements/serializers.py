from rest_framework import serializers

from apps.locations.models import Location

from .models import Paiement


class PaiementSerializer(serializers.ModelSerializer):
    location_label = serializers.SerializerMethodField()
    client_nom = serializers.CharField(source="location.client.nom_complet", read_only=True)
    mode_label = serializers.CharField(source="get_mode_display", read_only=True)

    class Meta:
        model = Paiement
        fields = [
            "id", "location", "location_label", "client_nom", "montant",
            "mode", "mode_label", "date_paiement", "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_location_label(self, obj):
        return f"#{obj.location_id} - {obj.location.voiture}"

    def validate(self, attrs):
        instance = self.instance
        location = attrs.get("location", getattr(instance, "location", None))
        montant = attrs.get("montant", getattr(instance, "montant", None))
        if location and location.statut == Location.Statut.ANNULEE:
            raise serializers.ValidationError({"location": "Cette location est annulée."})
        if location and montant is not None:
            deja = sum(
                p.montant
                for p in location.paiements.all()
                if not instance or p.pk != instance.pk
            )
            reste = location.prix_total - deja
            if montant > reste:
                raise serializers.ValidationError(
                    {"montant": f"Le montant dépasse le reste à payer ({reste})."}
                )
        return attrs
