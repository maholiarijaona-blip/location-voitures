from django.db import transaction
from django.utils import timezone

from apps.voitures.models import Voiture

from .models import Location


class LocationService:
    @staticmethod
    def calculer_prix(voiture, date_debut, date_fin):
        return voiture.prix_jour * ((date_fin - date_debut).days + 1)

    @staticmethod
    def synchroniser_voiture(voiture):
        if voiture.statut == Voiture.Statut.MAINTENANCE:
            return
        actif = voiture.locations.filter(
            statut=Location.Statut.EN_COURS, date_debut__lte=timezone.localdate()
        ).exists()
        nouveau = Voiture.Statut.LOUEE if actif else Voiture.Statut.DISPONIBLE
        if voiture.statut != nouveau:
            voiture.statut = nouveau
            voiture.save(update_fields=["statut"])

    @classmethod
    def synchroniser_tout(cls):
        for voiture in Voiture.objects.exclude(statut=Voiture.Statut.MAINTENANCE):
            cls.synchroniser_voiture(voiture)

    @classmethod
    @transaction.atomic
    def creer(cls, client, voiture, date_debut, date_fin, statut=Location.Statut.EN_COURS, date_retour=None):
        location = Location.objects.create(
            client=client,
            voiture=voiture,
            date_debut=date_debut,
            date_fin=date_fin,
            date_retour=date_retour,
            statut=statut,
            prix_total=cls.calculer_prix(voiture, date_debut, date_fin),
        )
        cls.synchroniser_voiture(voiture)
        return location

    @classmethod
    @transaction.atomic
    def modifier(cls, location, donnees):
        ancienne_voiture = location.voiture
        for champ, valeur in donnees.items():
            setattr(location, champ, valeur)
        location.prix_total = cls.calculer_prix(
            location.voiture, location.date_debut, location.date_fin
        )
        if location.statut == Location.Statut.TERMINEE and not location.date_retour:
            location.date_retour = timezone.localdate()
        location.save()
        cls.synchroniser_voiture(ancienne_voiture)
        cls.synchroniser_voiture(location.voiture)
        return location

    @classmethod
    @transaction.atomic
    def terminer(cls, location):
        location.statut = Location.Statut.TERMINEE
        location.date_retour = timezone.localdate()
        location.save(update_fields=["statut", "date_retour"])
        cls.synchroniser_voiture(location.voiture)
        return location

    @classmethod
    @transaction.atomic
    def supprimer(cls, location):
        voiture = location.voiture
        location.delete()
        cls.synchroniser_voiture(voiture)
