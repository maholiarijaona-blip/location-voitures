from datetime import timedelta

from django.db.models import Q
from django.utils import timezone
from rest_framework import serializers

from apps.voitures.models import Voiture

from .models import Location
from .services import LocationService


class LocationSerializer(serializers.ModelSerializer):
    client_nom = serializers.CharField(source="client.nom_complet", read_only=True)
    voiture_label = serializers.CharField(source="voiture.__str__", read_only=True)
    statut_label = serializers.CharField(source="get_statut_display", read_only=True)
    nb_jours = serializers.IntegerField(read_only=True)
    montant_paye = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    reste_a_payer = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)

    class Meta:
        model = Location
        fields = [
            "id", "client", "client_nom", "voiture", "voiture_label",
            "date_debut", "date_fin", "date_retour", "nb_jours", "prix_total",
            "montant_paye", "reste_a_payer", "statut", "statut_label", "created_at",
        ]
        read_only_fields = ["id", "prix_total", "created_at"]

    def validate(self, attrs):
        instance = self.instance
        debut = attrs.get("date_debut", getattr(instance, "date_debut", None))
        fin = attrs.get("date_fin", getattr(instance, "date_fin", None))
        voiture = attrs.get("voiture", getattr(instance, "voiture", None))
        statut = attrs.get("statut", getattr(instance, "statut", Location.Statut.EN_COURS))

        aujourdhui = timezone.localdate()

        if debut and (instance is None or debut != instance.date_debut) and debut < aujourdhui:
            raise serializers.ValidationError(
                {"date_debut": "La date de début ne peut pas être dans le passé."}
            )
        if fin and (instance is None or fin != instance.date_fin) and fin < aujourdhui:
            raise serializers.ValidationError(
                {"date_fin": "La date de fin ne peut pas être dans le passé."}
            )
        retour = attrs.get("date_retour", getattr(instance, "date_retour", None))
        if retour and (instance is None or retour != instance.date_retour):
            if retour < aujourdhui:
                raise serializers.ValidationError(
                    {"date_retour": "La date de retour ne peut pas être dans le passé."}
                )
            if debut and retour < debut:
                raise serializers.ValidationError(
                    {"date_retour": "La date de retour ne peut pas être avant la date de début."}
                )
        if debut and fin and fin < debut:
            raise serializers.ValidationError(
                {"date_fin": "La date de fin doit être postérieure ou égale à la date de début."}
            )
        if voiture and statut == Location.Statut.EN_COURS:
            if voiture.statut == Voiture.Statut.MAINTENANCE:
                raise serializers.ValidationError({"voiture": "Cette voiture est en maintenance."})
            if debut and fin:
                conflits = Location.objects.filter(
                    voiture=voiture, statut=Location.Statut.EN_COURS, date_debut__lte=fin
                ).filter(Q(date_fin__gte=debut) | Q(date_fin__lt=aujourdhui))
                if instance:
                    conflits = conflits.exclude(pk=instance.pk)
                conflit = conflits.order_by("-date_fin").first()
                if conflit:
                    if conflit.date_fin < aujourdhui:
                        message = "Cette voiture n'a pas encore été rendue par le client précédent."
                    else:
                        libre = conflit.date_fin + timedelta(days=1)
                        message = (
                            f"Cette voiture est déjà louée jusqu'au {conflit.date_fin:%d/%m/%Y}. "
                            f"Elle sera disponible à partir du {libre:%d/%m/%Y}."
                        )
                    raise serializers.ValidationError({"voiture": message})
        if instance and voiture and debut and fin:
            nouveau_prix = LocationService.calculer_prix(voiture, debut, fin)
            if nouveau_prix < instance.montant_paye:
                raise serializers.ValidationError(
                    {
                        "date_fin": (
                            f"Le nouveau prix ({nouveau_prix}) est inférieur "
                            f"au montant déjà payé ({instance.montant_paye})."
                        )
                    }
                )
        return attrs

    def create(self, validated_data):
        return LocationService.creer(**validated_data)

    def update(self, instance, validated_data):
        return LocationService.modifier(instance, validated_data)
