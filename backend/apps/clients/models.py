from django.conf import settings
from django.core.validators import RegexValidator
from django.db import models

phone_validator = RegexValidator(
    regex=r"^\+?\d{8,15}$",
    message="Numéro de téléphone invalide (8 à 15 chiffres, « + » optionnel).",
)


class Client(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="client_profile",
    )
    nom = models.CharField(max_length=100)
    prenom = models.CharField("prénom", max_length=100)
    email = models.EmailField(unique=True)
    telephone = models.CharField(max_length=20, unique=True, validators=[phone_validator])
    numero_permis = models.CharField("numéro de permis", max_length=30, unique=True)
    adresse = models.TextField(blank=True, default="")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "client"
        ordering = ["nom", "prenom"]

    def __str__(self):
        return f"{self.prenom} {self.nom}"

    @property
    def nom_complet(self):
        return f"{self.prenom} {self.nom}"
