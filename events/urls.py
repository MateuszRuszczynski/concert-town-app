from django.urls import path
from events.views import EventCreateView

urlpatterns = [
    path('events/', EventCreateView.as_view(), name='event-create'),
]
