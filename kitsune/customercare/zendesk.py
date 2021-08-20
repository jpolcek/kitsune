from django.conf import settings
from django.utils.translation import ugettext_lazy as _lazy
from zenpy import Zenpy
from zenpy.lib.api_objects import User as ZendeskUser, Ticket

TICKET_FORM_ID = 360000417171

# See docs/zendesk.md for details about getting the valid choice values for each field:

PRODUCT_FIELD_ID = 360047198211

CATEGORY_FIELD_ID = 360047206172
CATEGORY_CHOICES = [
    ("technical", _lazy("Technical")),
    ("accounts", _lazy("Accounts & Login")),
    ("payments", _lazy("Payment & Billing")),
    ("troubleshooting", _lazy("Troubleshooting")),
]

OS_FIELD_ID = 360018604871
OS_CHOICES = [
    (None, ""),
    ("win10", _lazy("Windows")),
    ("android", _lazy("Android")),
    ("linux", _lazy("Linux")),
    ("web", _lazy("Web")),
    ("mac", _lazy("Mac OS")),
    ("win8", _lazy("Windows 8")),
]


class ZendeskClient(object):
    """Client to connect to Zendesk API."""

    def __init__(self, **kwargs):
        """Initialize Zendesk API client."""
        creds = {
            "email": settings.ZENDESK_USER_EMAIL,
            "token": settings.ZENDESK_API_TOKEN,
            "subdomain": settings.ZENDESK_SUBDOMAIN,
        }
        self.client = Zenpy(**creds)

    def _user_to_zendesk_user(self, user):
        fxa_uid = user.profile.fxa_uid
        id_str = user.profile.zendesk_id
        return ZendeskUser(
            id=int(id_str) if id_str else None,
            verified=True,
            email=user.email,
            name=user.profile.display_name,
            locale=user.profile.locale,
            user_fields={"user_id": fxa_uid},
            external_id=fxa_uid,
        )

    def create_user(self, user):
        """Given a Django user, create a user in Zendesk."""
        zendesk_user = self._user_to_zendesk_user(user)
        # call create_or_update to avoid duplicating users FxA previously created
        zendesk_user = self.client.users.create_or_update(zendesk_user)

        user.profile.zendesk_id = str(zendesk_user.id)
        user.profile.save(update_fields=["zendesk_id"])

        return zendesk_user

    def update_user(self, user):
        """Given a Django user, update a user in Zendesk."""
        zendesk_user = self._user_to_zendesk_user(user)
        zendesk_user = self.client.users.update(zendesk_user)
        # TODO: if we're updating a user's email, zendesk will add it as a secondary identity
        # we need to call a separate api (not implemented by zenpy) to update it to primary:
        # https://developer.zendesk.com/api-reference/ticketing/users/user_identities/#make-identity-primary
        return zendesk_user

    def create_ticket(
        self, user, subject="", description="", product="", category="", os="", **kwargs
    ):
        """Create a ticket in Zendesk."""
        ticket = Ticket(
            subject=subject,
            comment={"body": description},
            ticket_form_id=TICKET_FORM_ID,
            custom_fields=[
                {"id": PRODUCT_FIELD_ID, "value": product},
                {"id": CATEGORY_FIELD_ID, "value": category},
                {"id": OS_FIELD_ID, "value": os},
            ],
        )
        if user.profile.zendesk_id:
            # TODO: is this necessary if we're updating users as soon as they're updated locally?
            ticket.requester_id = self.update_user(user).id
        else:
            ticket.requester_id = self.create_user(user).id
        return self.client.tickets.create(ticket)